package com.example.footballbooking.repository;

import com.example.footballbooking.entity.FieldStatus;
import com.example.footballbooking.entity.FieldType;
import com.example.footballbooking.entity.FootballField;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

// Bộ lọc tìm kiếm động cho sân bóng đá
public class FieldSpecification {

    public static Specification<FootballField> filterFields(
            String keyword,
            String city,
            String district,
            FieldType fieldType,
            Long minPrice,
            Long maxPrice,
            FieldStatus status
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Lọc theo từ khóa tìm kiếm (tên sân hoặc địa chỉ)
            if (StringUtils.hasText(keyword)) {
                String searchPattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate nameLike = cb.like(cb.lower(root.get("name")), searchPattern);
                Predicate addressLike = cb.like(cb.lower(root.get("address")), searchPattern);
                predicates.add(cb.or(nameLike, addressLike));
            }

            // Lọc theo tỉnh/thành phố
            if (StringUtils.hasText(city)) {
                predicates.add(cb.equal(cb.lower(root.get("city")), city.trim().toLowerCase()));
            }

            // Lọc theo quận/huyện
            if (StringUtils.hasText(district)) {
                predicates.add(cb.equal(cb.lower(root.get("district")), district.trim().toLowerCase()));
            }

            // Lọc theo loại sân (sân 5, 7, 11)
            if (fieldType != null) {
                predicates.add(cb.equal(root.get("fieldType"), fieldType));
            }

            // Lọc theo khoảng giá
            if (minPrice != null && minPrice > 0) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("basePrice"), minPrice));
            }
            if (maxPrice != null && maxPrice > 0) {
                predicates.add(cb.lessThanOrEqualTo(root.get("basePrice"), maxPrice));
            }

            // Lọc theo trạng thái sân (khách hàng chỉ xem sân ACTIVE)
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
