<template>
    <div>
        <div>
            <MainNav @signup="showSignUpModal" @login="showLoginModal" />

            <!-- Sign Up / Login Modal -->
            <b-modal v-model="modalActive" :can-cancel="['escape', 'click', 'outside']">
                <div class="modal-container">
                    <div class="modal-card">
                        <header class="modal-card-head">
                            <p class="modal-card-title">{{ modalTitle }}</p>
                            <button class="delete" aria-label="close" @click="closeModals"></button>
                        </header>
                        <section class="modal-card-body">
                            <LoginSignUpForm @close="closeModals" :isSignUp="isSignUp" />
                        </section>
                    </div>
                </div>
            </b-modal>

        </div>
        <div>
            <div class="select mb-2">
                <select v-model="currentCategory">
                    <option value="">All Categories</option>
                    <option v-for="category in categories" :key="category" :value="category">
                        {{ category }}
                    </option>
                </select>
            </div>
            <button class="button is-danger is-light" @click="resetFilter">Reset</button>
            <div class="columns is-multiline is-mobile mt-4">
                <div v-for="auction in filteredAuctions" :key="auction.productId" class="column is-one-quarter">
                    <!-- Card content -->
                </div>
            </div>
        </div>
        <div>
            <div class="columns is-multiline is-mobile mt-4">
                <div v-for="auction in filteredAuctions" :key="auction.productId" class="column is-one-quarter">
                    <div class="card" :id="'card-' + auction.productId" @mouseenter="showBidButton(auction)"
                        @mouseleave="hideBidButton(auction)">
                        <button v-if="auction.showBidButton" class="button is-primary bid-button"
                            @click="flipCard(auction)">
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
            </div>
        </div>
        <InputCard v-if="isInputCardVisible" @hideInputCard="hideInputCard" />
    </div>
</template>

<script>
import axios from "axios";
import MainNav from "@/components/MainNav.vue";
import LoginSignUpForm from "@/components/LoginSignUpForm.vue";

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
            isSignUp: false,
            modalTitle: ""
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
                console.log("Response data:", response.data);
                const newAuctions = response.data.filter(
                    (newAuction) => !this.auctions.some((auction) => auction.productId === newAuction.productId)
                );
                console.log("New auctions:", newAuctions);
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
        confirmBid(auction) { },
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
            this.isSignUp = true;
            this.modalTitle = "Sign Up";
            this.modalActive = true;
        },
        showLoginModal() {
            this.isSignUp = false;
            this.modalTitle = "Login";
            this.modalActive = true;
        },
        closeModals() {
            this.modalActive = false;
        },
        showInputCard() {
            this.isInputCardVisible = true;
        },
        hideInputCard() {
            this.isInputCardVisible = false;
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
        }
    }
};
</script>

<style scoped>
.select {
    margin-left: 20px;
}

.card {
    position: relative;
    transition: transform 0.5s;
}

.card-content {
    transition: filter 0.5s;
}

.bid-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}

.front-card-content {
    transition: filter 0.5s;
}

.card-blur {
    filter: blur(3px) grayscale(80%);
}

.custom-section {
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
}

.custom-section .title {
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-card {
    border-radius: 20px;
    /* Increased border-radius for rounder edges */
    width: 400px;
    height: 500px;
}

/* Hide body scroll when modal is active */
body.modal-open {
    overflow: hidden;
}
</style>