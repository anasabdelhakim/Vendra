package com.marketplace.controller;

import com.marketplace.dto.ListingRequest;
import com.marketplace.model.Listing;
import com.marketplace.service.ListingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    // Create listing
    @PostMapping
    public Listing createListing(@RequestBody ListingRequest request) {
        return listingService.createListing(request);
    }

    // My listings (seller dashboard)
    @GetMapping("/mine")
    public List<Listing> getMyListings() {
        return listingService.getMyListings();
    }

    // Explore listings
    @GetMapping
    public List<Listing> getAllListings() {
        return listingService.getAllActiveListings();
    }

    // Listing details
    @GetMapping("/{id}")
    public Listing getListing(@PathVariable Long id) {
        return listingService.getListingById(id);
    }

    // Edit listing
    @PutMapping("/{id}")
    public Listing updateListing(
            @PathVariable Long id,
            @RequestBody ListingRequest request
    ) {
        return listingService.updateListing(id, request);
    }

    // Mark as sold
    @PatchMapping("/{id}/sold")
    public void markAsSold(@PathVariable Long id) {
        listingService.markAsSold(id);
    }
}
