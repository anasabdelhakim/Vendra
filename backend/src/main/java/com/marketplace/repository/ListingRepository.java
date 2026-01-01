package com.marketplace.repository;

import com.marketplace.model.Listing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {
    List<Listing> findBySellerId(Long sellerId);
    List<Listing> findByStatus(Listing.Status status);
}
