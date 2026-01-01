package com.marketplace.service;

import com.marketplace.dto.ListingRequest;
import com.marketplace.model.Listing;
import com.marketplace.repository.ListingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListingService {

    private final ListingRepository listingRepository;

    public ListingService(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    /**
     * TEMP: simulate authenticated user
     * Later replaced by SecurityContext / JWT / Supabase user
     */
    private Long getCurrentUserId() {
        return 1L;
    }

    public Listing createListing(ListingRequest request) {
        Listing listing = new Listing();
        listing.setSellerId(getCurrentUserId());
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setBrand(request.getBrand());
        listing.setCarModel(request.getCarModel());
        listing.setYear(request.getYear());
        listing.setMileage(request.getMileage());
        listing.setLocation(request.getLocation());
        listing.setStatus(Listing.Status.ACTIVE);

        return listingRepository.save(listing);
    }

    public List<Listing> getMyListings() {
        return listingRepository.findBySellerId(getCurrentUserId());
    }

    public Listing updateListing(Long listingId, ListingRequest request) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getSellerId().equals(getCurrentUserId())) {
            throw new RuntimeException("You are not allowed to edit this listing");
        }

        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setBrand(request.getBrand());
        listing.setCarModel(request.getCarModel());
        listing.setYear(request.getYear());
        listing.setMileage(request.getMileage());
        listing.setLocation(request.getLocation());

        return listingRepository.save(listing);
    }

    public void markAsSold(Long listingId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getSellerId().equals(getCurrentUserId())) {
            throw new RuntimeException("You are not allowed to update this listing");
        }

        listing.setStatus(Listing.Status.SOLD);
        listingRepository.save(listing);
    }

    public List<Listing> getAllActiveListings() {
        return listingRepository.findByStatus(Listing.Status.ACTIVE);
    }

    public Listing getListingById(Long id) {
        return listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
    }
}
