import React from 'react';

const PriceRange = ({ maxPrice, onChange }) => {
  return (
<div className="price-range d-flex align-items-center gap-2">
  <label htmlFor="priceRange" className="form-label mb-0 small">
    <strong>${maxPrice}</strong>
  </label>
  <input
    type="range"
    className="form-range "
    id="priceRange"
    min="0"
    max="150"
    step="25"
    value={maxPrice}
    onChange={(e) => onChange(Number(e.target.value))}
  />
</div>

  );
};

export default PriceRange;
