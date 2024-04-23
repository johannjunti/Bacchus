<template>
    <div>
        <div>
            <MainNav @signup="showSignUpModal" @login="showLoginModal" />
            <b-modal v-model="modalActive" :can-cancel="['escape', 'click', 'outside']">
                <div class="modal-container">
                    <div class="modal-card">
                        <header class="modal-card-head">
                            <h1 class="modal-card-title">{{ modalTitle }}</h1>
                            <button class="delete" aria-label="close" @click="closeModals"></button>
                        </header>
                        <section class="modal-card-body">
                            <LoginSignUpForm :is-sign-up="isSignUp" @toggle-form="toggleForm" />
                        </section>
                    </div>
                </div>
            </b-modal>
        </div>
        <div class="field has-addons">
            <p class="control">
                <b-dropdown aria-role="list" v-model="currentCategory">
                    <template #trigger>
                        <b-button :label="selectedCategoryLabel" :icon-right="dropdownActive ? 'menu-up' : 'menu-down'"
                            type="is-info" />
                    </template>

                    <b-dropdown-item aria-role="listitem" value="">All Categories</b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" v-for="category in categories" :key="category"
                        :value="category">
                        {{ category }}
                    </b-dropdown-item>
                </b-dropdown>
            </p>
            <p class="control">
                <button class="button is-danger is-light" @click="resetFilter">Reset</button>
            </p>
        </div>
        <div>

            <transition-group tag="div" class="columns is-multiline is-mobile mt-4">
                <div v-for="auction in filteredAuctions" :key="auction.productId" class="column is-one-quarter">
                    <div class="card" :id="'card-' + auction.productId" @mouseenter="showBidButton(auction)"
                        @mouseleave="hideBidButton(auction)">
                        <button v-if="auction.showBidButton && isAuthenticated" class="button is-primary bid-button"
                            @click="flipCard(auction)">
                            Bid
                        </button>
                        <button v-else-if="auction.showBidButton && !isAuthenticated"
                            class="button is-primary bid-button" @click="showLoginModal">
                            Bid
                        </button>
                        <div v-if="!auction.isFlipped" class="card-content"
                            :class="{ 'card-blur': auction.showBidButton }">
                            <div class="media">
                                <div class="media-content">
                                    <p class="title is-5">{{ auction.productName }}</p>
                                    <p class="subtitle is-6">{{ auction.productDescription }}</p>
                                </div>
                            </div>
                            <div class="content">
                                <p>Remaining Time: {{ getRemainingTime(auction) }}</p>
                            </div>
                        </div>
                        <div v-else class="card-content">
                            <div class="media">
                                <div class="media-content">
                                    <p class="title is-5">{{ auction.productName }}</p>
                                    <p class="subtitle is-6">{{ auction.productDescription }}</p>
                                </div>
                            </div>
                            <div class="content">
                                <p>Remaining Time: {{ getRemainingTime(auction) }}</p>
                                <div class="field">
                                    <label class="label">Full Name</label>
                                    <div class="control">
                                        <input class="input" type="text" v-model="auction.fullName"
                                            placeholder="Enter your full name" />
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label">EUR</label>
                                    <div class="control">
                                        <input class="input" type="number" v-model="auction.eur"
                                            placeholder="Enter your bid amount" />
                                    </div>
                                </div>
                                <button class="button is-success" @click="confirmBid(auction)">Confirm Bid</button>
                                <button class="button is-warning undo-button" @click="undoBid(auction)">Undo</button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import MainNav from "@/components/MainNav.vue";
import LoginSignUpForm from "@/components/LoginSignUpForm.vue";
import { useAuthStore } from '../store/auth.js'

import "@/styles/home.css";

export default {
    name: "Home",
    components: {
        MainNav,
        LoginSignUpForm
    },
    data() {
        return {
            auctions: [],
            categories: [],
            currentCategory: null,
            modalActive: false,
            modalTitle: "Sign Up",
            isSignUp: false,
            isFormVisible: false,
            dropdownActive: false,
            isAuthenticated: false,
        };
    },
    mounted() {
        this.fetchAuctions();
        setInterval(() => {
            this.updateAuctionEndDates();
        }, 1000);
        setInterval(() => {
            this.fetchAuctions();
        }, 5000);
    },
    methods: {
        async fetchAuctions() {
            try {
                const response = await axios.get("http://localhost:3000/api/auctions");
                if (!Array.isArray(response.data)) {
                    console.error("Error fetching auctions:", response.data);
                    return;
                }
                const newAuctions = response.data.filter(
                    (newAuction) => !this.auctions.some((auction) => auction.productId === newAuction.productId)
                );
                this.auctions = [...this.auctions, ...newAuctions];
                this.extractCategories();
            } catch (error) {
                console.error("Error fetching auctions:", error);
            }
        },
        extractCategories() {
            const categoriesSet = new Set();
            this.auctions.forEach((auction) => {
                categoriesSet.add(auction.productCategory);
            });
            this.categories = Array.from(categoriesSet);
        },
        filterByCategory(category) {
            this.currentCategory = category;
        },
        resetFilter() {
            this.currentCategory = null;
        },
        getRemainingTime(auction) {
            const endDate = new Date(auction.biddingEndDate);
            const now = new Date();
            if (endDate <= now) {
                return "Auction ended";
            } else {
                const diff = endDate - now;
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                return `${minutes} minutes ${seconds} seconds`;
            }
        },
        flipCard(auction) {
            auction.isFlipped = !auction.isFlipped;
            auction.showBidButton = false;
        },
        confirmBid(auction) {
            // Implement bid confirmation logic
        },
        undoBid(auction) {
            auction.isFlipped = false;
        },
        updateAuctionEndDates() {
            const now = new Date();
            this.auctions = this.auctions.filter((auction) => {
                const endDate = new Date(auction.biddingEndDate);
                return endDate > now;
            });
        },
        updateRemainingTime() {
            this.auctions.forEach((auction) => {
                auction.remainingTime = this.getRemainingTime(auction);
            });
        },
        showSignUpModal() {
            console.log("Showing sign-up modal");
            this.isSignUp = true;
            this.modalTitle = "Sign Up";
            this.modalActive = true;
        },

        showLoginModal() {
            console.log("Showing login modal");
            this.isSignUp = false;
            this.modalTitle = "Login";
            this.modalActive = true;
        },
        closeModals() {
            this.isFormVisible = false;
            this.modalActive = false;
        },
        toggleForm(isSignUp) {
            this.isSignUp = isSignUp;
            this.modalTitle = isSignUp ? "Sign Up" : "Login";
        },
        showBidButton(auction) {
            auction.showBidButton = !auction.isFlipped;
        },
        hideBidButton(auction) {
            auction.showBidButton = false;
        },
    },

    computed: {
        filteredAuctions() {
            if (!this.currentCategory) return this.auctions;
            return this.auctions.filter((auction) => auction.productCategory === this.currentCategory);
        },
        selectedCategoryLabel() {
            return this.currentCategory ? this.currentCategory : 'All Categories';
        },
    }
};
</script>