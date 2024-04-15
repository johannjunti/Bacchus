<template>
    <div>
        <b-dropdown aria-role="list" v-model="isDropdownOpen">
            <template #trigger="{ active }">
                <b-button label="Filter by Category" type="is-primary" :icon-right="active ? 'menu-up' : 'menu-down'" />
            </template>

            <b-dropdown-item v-for="category in categories" :key="category" @click="filterByCategory(category)"
                aria-role="listitem">
                {{ category }}
            </b-dropdown-item>
        </b-dropdown>

        <b-button @click="resetFilter" type="is-danger">Reset Filter</b-button>

        <div v-for="auction in filteredAuctions" :key="auction.productId">
            <h2>{{ auction.productName }}</h2>
            <p>Description: {{ auction.productDescription }}</p>
            <p>Remaining Time: {{ getRemainingTime(auction.biddingEndDate) }}</p>
            
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Home',
    data() {
        return {
            auctions: [],
            categories: [],
            isDropdownOpen: false,
            currentCategory: null, 
        };
    },
    mounted() {
        this.fetchAuctions();
    },
    methods: {
        async fetchAuctions() {
            try {
                const response = await axios.get('http://localhost:3000/api/auctions');
                this.auctions = response.data;
                this.extractCategories();
            } catch (error) {
                console.error('Error fetching auctions:', error);
            }
        },
        extractCategories() {
            const categoriesSet = new Set();
            this.auctions.forEach(auction => {
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
        getRemainingTime(biddingEndDate) {
            const endDate = new Date(biddingEndDate);
            const now = new Date();
            const diff = endDate - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return `${days} days ${hours} hours ${minutes} minutes`;
        },
    },
    computed: {
        filteredAuctions() {
            if (!this.currentCategory) return this.auctions;
            return this.auctions.filter(auction => auction.productCategory === this.currentCategory);
        },
    },
};
</script>