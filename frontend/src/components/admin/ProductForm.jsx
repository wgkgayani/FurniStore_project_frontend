import React, { useState, useEffect } from "react";
import { X, Plus, Image } from "react-bootstrap-icons";
import { motion, AnimatePresence } from "framer-motion";

const ProductForm = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    description: "",
    price: "",
    labelledPrice: "",
    stock: "",
    category: "",
    images: [],
    altNames: [],
    isAvailable: true,
  });

  const [imageUrl, setImageUrl] = useState("");
  const [altName, setAltName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl],
      });
      setImageUrl("");
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const addAltName = () => {
    if (altName.trim()) {
      setFormData({
        ...formData,
        altNames: [...formData.altNames, altName],
      });
      setAltName("");
    }
  };

  const removeAltName = (index) => {
    setFormData({
      ...formData,
      altNames: formData.altNames.filter((_, i) => i !== index),
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productId) newErrors.productId = "Product ID is required";
    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.stock) newErrors.stock = "Stock is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.images.length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {product ? "Edit Product" : "Add New Product"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Product ID *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.productId ? "is-invalid" : ""}`}
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    placeholder="e.g., FURN001"
                  />
                  {errors.productId && (
                    <div className="invalid-feedback">{errors.productId}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Modern Leather Sofa"
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Description *</label>
                <textarea
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Detailed product description..."
                />
                {errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>

              {/* Pricing */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Price *</label>
                  <input
                    type="number"
                    className={`form-control ${errors.price ? "is-invalid" : ""}`}
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <div className="invalid-feedback">{errors.price}</div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Labelled Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="labelledPrice"
                    value={formData.labelledPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Stock *</label>
                  <input
                    type="number"
                    className={`form-control ${errors.stock ? "is-invalid" : ""}`}
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <div className="invalid-feedback">{errors.stock}</div>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Category *</label>
                  <select
                    className={`form-select ${errors.category ? "is-invalid" : ""}`}
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    <option value="sofa">Sofas</option>
                    <option value="bed">Beds</option>
                    <option value="table">Tables</option>
                    <option value="chair">Chairs</option>
                    <option value="wardrobe">Wardrobes</option>
                    <option value="desk">Desks</option>
                    <option value="bookshelf">Bookshelf</option>
                    <option value="tv-console">TV Console</option>
                  </select>
                  {errors.category && (
                    <div className="invalid-feedback">{errors.category}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <div className="form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleChange}
                      id="isAvailable"
                    />
                    <label className="form-check-label" htmlFor="isAvailable">
                      Available for sale
                    </label>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="mb-3">
                <label className="form-label">Product Images *</label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addImage}
                  >
                    <Plus /> Add
                  </button>
                </div>

                {errors.images && (
                  <div className="text-danger small mb-2">{errors.images}</div>
                )}

                <div className="row g-2">
                  <AnimatePresence>
                    {formData.images.map((img, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="col-md-3 position-relative"
                      >
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="img-fluid rounded"
                          style={{
                            height: "100px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                          onClick={() => removeImage(index)}
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Alternative Names */}
              <div className="mb-3">
                <label className="form-label">Alternative Names</label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter alternative name"
                    value={altName}
                    onChange={(e) => setAltName(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addAltName}
                  >
                    <Plus /> Add
                  </button>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <AnimatePresence>
                    {formData.altNames.map((name, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="badge bg-light text-dark p-2 d-flex align-items-center"
                      >
                        {name}
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger p-0 ms-2"
                          onClick={() => removeAltName(index)}
                        >
                          <X size={12} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
