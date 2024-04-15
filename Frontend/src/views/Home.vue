<template>
    <div>
        <!-- Filter card -->
        <div class="card">
            <div class="card-content">
                <!-- Filter dropdown -->
                <div class="select mb-2">
                    <select v-model="currentCategory">
                        <option value="">All Categories</option>
                        <option v-for="category in categories" :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>
                </div>
                <!-- Reset button -->
                <button class="button is-danger is-light" @click="resetFilter">
                    Reset
                </button>
            </div>
        </div>
        <!-- Auction cards -->
        <div class="columns is-multiline is-mobile mt-4">
            <div v-for="auction in filteredAuctions" :key="auction.productId" class="column is-one-quarter">
                <div class="card" :id="'card-' + auction.productId" @mouseenter="showBidButton(auction)"
                    @mouseleave="hideBidButton(auction)">
                    <!-- Bid button -->
                    <button v-if="auction.showBidButton" class="button is-primary bid-button"
                        @click="flipCard(auction)">
                        Bid
                    </button>
                    <!-- Front of the card -->
                    <div v-if="!auction.isFlipped" class="card-content" :class="{ 'card-blur': auction.showBidButton }">
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
                    <!-- Back of the card -->
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
                            <button class="button is-success" @click="confirmBid(auction)">
                                Confirm Bid
                            </button>
                            <button class="button is-warning undo-button" @click="undoBid(auction)">
                                Undo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "Home",
    data() {
        return {
            auctions: [],
            categories: [],
            currentCategory: null,
        };
    },
    mounted() {
        this.fetchAuctions();
        // Automatically update auctions every second
        setInterval(this.updateAuctions, 1000);
    },
    methods: {
        async fetchAuctions() {
            try {
                const response = await axios.get("http://localhost:3000/api/auctions");
                this.auctions = response.data;
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
            const diff = endDate - now;
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000); // Remaining seconds
            return `${minutes} minutes ${seconds} seconds`;
        },
        showBidButton(auction) {
            auction.showBidButton = !auction.isFlipped; // Only show bid button if the card is not flipped
        },
        hideBidButton(auction) {
            auction.showBidButton = false;
        },
        flipCard(auction) {
            console.log("Flipping card for auction:", auction.productId);
            auction.isFlipped = !auction.isFlipped; // Toggle flipped state
            auction.bidded = true;
            console.log("isFlipped:", auction.isFlipped); // Log the value of isFlipped
        },
        confirmBid(auction) {
            // Handle bid confirmation
        },
        undoBid(auction) {
            auction.isFlipped = false;
        },
        updateAuctions() {
            // Update auctions every second
            this.auctions.forEach((auction) => {
                const endDate = new Date(auction.biddingEndDate);
                const now = new Date();
                if (endDate <= now) {
                    // If the bidding end date is reached, update the auction
                    this.fetchAuctions();
                }
            });
        },
    },
    computed: {
        filteredAuctions() {
            if (!this.currentCategory) return this.auctions;
            return this.auctions.filter(
                (auction) => auction.productCategory === this.currentCategory
            );
        },
    },
};
</script>
<style scoped>
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
</style>
