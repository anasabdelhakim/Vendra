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
     * Later replaced by real auth (SecurityContext/JWT/Supabase etc.)
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

        // DB requires these NOT NULL:
        listing.setBrand(request.getBrand());
        listing.setModel(request.getCarModel()); // maps to DB column `model`

        listing.setYear(request.getYear());
        listing.setMileage(request.getMileage());
        listing.setLocation(request.getLocation());
        listing.setFuelType(request.getFuelType());

        // Must match DB constraint:
        listing.setStatus(Listing.Status.PENDING);

        return listingRepository.save(listing);
    }

    public List<Listing> getMyListings() {
        return listingRepository.findBySellerId(getCurrentUserId());
    }

    public Listing updateListing(Long listingId, ListingRequest request) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (listing.getSellerId() == null || !listing.getSellerId().equals(getCurrentUserId())) {
            throw new RuntimeException("You are not allowed to edit this listing");
        }

        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());

        listing.setBrand(request.getBrand());
        listing.setModel(request.getCarModel());

        listing.setYear(request.getYear());
        listing.setMileage(request.getMileage());
        listing.setLocation(request.getLocation());
        listing.setFuelType(request.getFuelType());

        return listingRepository.save(listing);
    }

    /**
     * Since the DB constraint doesn't include SOLD,
     * we map "sold" to REJECTED for now.
     * Later: update DB constraint + enum to add SOLD properly.
     */
    public void markAsSold(Long listingId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (listing.getSellerId() == null || !listing.getSellerId().equals(getCurrentUserId())) {
            throw new RuntimeException("You are not allowed to update this listing");
        }

        listing.setStatus(Listing.Status.REJECTED);
        listingRepository.save(listing);
    }

    public List<Listing> getAllApprovedListings() {
        return listingRepository.findByStatus(Listing.Status.APPROVED);
    }

    public Listing getListingById(Long id) {
        return listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
    }
}
