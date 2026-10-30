import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Image as ImageIcon, Save, RefreshCw, AlertCircle, UploadCloud, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Baking', 'Vegetarian', 'Snack', 'Beverage', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';

export default function RecipeForm({ isEdit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Dinner',
    difficulty: 'Medium',
    prep_time: 15,
    cook_time: 30,
    servings: 4,
    image_url: '',
  });

  const [ingredients, setIngredients] = useState([
    { name: '', amount: '', unit: '' },
    { name: '', amount: '', unit: '' },
  ]);

  const [steps, setSteps] = useState([
    { instruction: '' },
    { instruction: '' },
  ]);

  const [loadingInitial, setLoadingInitial] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Local image upload handling
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Fetch recipe data if in Edit mode
  useEffect(() => {
    if (!isEdit || !id) return;

    let isMounted = true;
    setLoadingInitial(true);

    api.get(`/recipes/${id}`)
      .then((res) => {
        if (!isMounted) return;
        const data = res.data?.data || res.data;
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'Dinner',
          difficulty: data.difficulty || 'Medium',
          prep_time: data.prep_time ?? 15,
          cook_time: data.cook_time ?? 30,
          servings: data.servings ?? 4,
          image_url: data.image_url || '',
        });

        if (data.ingredients && data.ingredients.length > 0) {
          setIngredients(
            data.ingredients.map((ing) => ({
              id: ing.id,
              name: ing.name || '',
              amount: ing.amount ?? '',
              unit: ing.unit || '',
            }))
          );
        }

        if (data.steps && data.steps.length > 0) {
          const sorted = [...data.steps].sort((a, b) => (a.step_number || 0) - (b.step_number || 0));
          setSteps(
            sorted.map((s) => ({
              id: s.id,
              instruction: s.instruction || '',
            }))
          );
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to load recipe for editing:', err);
        setErrorMessage('Failed to load recipe data for editing.');
      })
      .finally(() => {
        if (isMounted) setLoadingInitial(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isEdit, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size must be less than 10MB.');
      return;
    }

    setUploadingImage(true);
    setUploadError('');

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const res = await api.post('/upload-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          image_url: res.data.url,
        }));
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
      setUploadError(
        err.response?.data?.message || 'Failed to upload image from your computer. Please try another photo.'
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // Ingredients handlers
  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addIngredientRow = () => {
    setIngredients((prev) => [...prev, { name: '', amount: '', unit: '' }]);
  };

  const removeIngredientRow = (index) => {
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  // Steps handlers
  const handleStepChange = (index, value) => {
    setSteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], instruction: value };
      return next;
    });
  };

  const addStepRow = () => {
    setSteps((prev) => [...prev, { instruction: '' }]);
  };

  const removeStepRow = (index) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setValidationErrors({});

    // Filter out completely empty ingredient and step rows
    const cleanedIngredients = ingredients
      .filter((ing) => ing.name.trim() !== '')
      .map((ing) => ({
        name: ing.name.trim(),
        amount: ing.amount !== '' && ing.amount !== null && ing.amount !== undefined ? String(ing.amount).trim() : null,
        unit: ing.unit.trim() || null,
      }));

    const cleanedSteps = steps
      .filter((step) => step.instruction.trim() !== '')
      .map((step, idx) => ({
        step_number: idx + 1,
        instruction: step.instruction.trim(),
      }));

    if (!formData.title.trim()) {
      setErrorMessage('Please provide a title for the recipe.');
      setSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      prep_time: formData.prep_time !== '' ? parseInt(formData.prep_time, 10) : 0,
      cook_time: formData.cook_time !== '' ? parseInt(formData.cook_time, 10) : 0,
      servings: formData.servings !== '' ? parseInt(formData.servings, 10) : 4,
      image_url: formData.image_url.trim() || null,
      ingredients: cleanedIngredients,
      steps: cleanedSteps,
    };

    try {
      let response;
      if (isEdit) {
        response = await api.put(`/recipes/${id}`, payload);
      } else {
        response = await api.post('/recipes', payload);
      }

      const createdRecipe = response.data?.data || response.data;
      const targetId = createdRecipe?.id || id;
      navigate(targetId ? `/recipes/${targetId}` : '/');
    } catch (err) {
      console.error('Failed to save recipe:', err);
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
        setErrorMessage('Please correct the highlighted form errors below.');
      } else {
        setErrorMessage(err.response?.data?.message || 'We couldn’t save your recipe. Please check your internet connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        <RefreshCw size={36} className="spin" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
        <p style={{ fontSize: '1.05rem', fontWeight: 500 }}>Loading recipe…</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to={isEdit ? `/recipes/${id}` : '/'} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>{isEdit ? 'Cancel & Return' : 'Back to Recipes'}</span>
        </Link>
      </div>

      <div className="form-card">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.1rem', marginBottom: '0.4rem' }}>
            {isEdit ? 'Edit Recipe' : 'Craft a New Recipe'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
            {isEdit
              ? 'Update instructions, modify quantities, or tweak preparation times.'
              : 'Add your culinary formula with accurate serving measurements and cooking instructions.'}
          </p>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.92rem',
              border: '1px solid #FECACA',
            }}
          >
            <AlertCircle size={20} flexShrink={0} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Core Details */}
          <section className="form-section">
            <h2 className="section-title">1. Essential Information</h2>
            <p className="section-desc">Basic recipe profile, category, and taste introduction.</p>

            <div className="form-group">
              <label className="form-label" htmlFor="title">Recipe Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                placeholder="e.g., Creamy Tuscan Garlic Chicken"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              {validationErrors.title && (
                <span style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>
                  {validationErrors.title[0]}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Short Description / Chef's Note</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="form-textarea"
                placeholder="Describe flavors, origins, pairing suggestions, or what makes this dish memorable..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="difficulty">Difficulty Tier</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  className="form-select"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  {DIFFICULTIES.map((diff) => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="prep_time">Prep Time (mins)</label>
                <input
                  id="prep_time"
                  name="prep_time"
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.prep_time}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cook_time">Cook Time (mins)</label>
                <input
                  id="cook_time"
                  name="cook_time"
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.cook_time}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="servings">Base Servings</label>
                <input
                  id="servings"
                  name="servings"
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.servings}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Recipe Cover Photo</label>

              {/* Upload Mode Selector */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`chip ${imageMode === 'upload' ? 'active' : ''}`}
                  onClick={() => setImageMode('upload')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.4rem 0.95rem' }}
                >
                  <UploadCloud size={15} />
                  <span>Upload from Computer</span>
                </button>
                <button
                  type="button"
                  className={`chip ${imageMode === 'url' ? 'active' : ''}`}
                  onClick={() => setImageMode('url')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.4rem 0.95rem' }}
                >
                  <LinkIcon size={14} />
                  <span>Paste Web Link</span>
                </button>
              </div>

              {imageMode === 'upload' ? (
                <div
                  style={{
                    border: '2px dashed var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.75rem 1.25rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-canvas)',
                    position: 'relative',
                    cursor: uploadingImage ? 'wait' : 'pointer',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <input
                    type="file"
                    id="image-file-input"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/avif"
                    onChange={handleFileUpload}
                    disabled={uploadingImage}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: uploadingImage ? 'wait' : 'pointer',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                  {uploadingImage ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <RefreshCw size={28} className="spin" color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
                      <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        Uploading picture from computer...
                      </p>
                    </div>
                  ) : (
                    <>
                      <UploadCloud size={34} color="var(--primary)" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                        Click to browse or drop your downloaded picture
                      </p>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block' }}>
                        Supports JPG, PNG, WEBP, or GIF from your device (Max 10MB)
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <input
                    id="image_url"
                    name="image_url"
                    type="url"
                    className="form-input"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.image_url}
                    onChange={handleInputChange}
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.35rem', display: 'block' }}>
                    Paste any image link from Unsplash or the web.
                  </span>
                </>
              )}

              {uploadError && (
                <div style={{ color: '#DC2626', fontSize: '0.82rem', marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertCircle size={15} />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Active Image Preview Card */}
              {formData.image_url && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', overflow: 'hidden' }}>
                    <img
                      src={formData.image_url}
                      alt="Recipe Preview"
                      style={{ width: '70px', height: '52px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                      onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--sage)' }}>
                        <CheckCircle2 size={15} /> Picture Ready
                      </span>
                      <p style={{ fontSize: '0.76rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '340px' }}>
                        {formData.image_url}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', flexShrink: 0 }}
                    onClick={() => setFormData((prev) => ({ ...prev, image_url: '' }))}
                  >
                    Change / Remove
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Dynamic Ingredients */}
          <section className="form-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <h2 className="section-title">2. Ingredients Checklist</h2>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={addIngredientRow}
              >
                <Plus size={15} />
                <span>Add Ingredient</span>
              </button>
            </div>
            <p className="section-desc">Enter amounts, units (e.g., cups, tbsp, g), and ingredient names.</p>

            {ingredients.map((ing, idx) => (
              <div key={idx} className="dynamic-row">
                <input
                  type="number"
                  step="any"
                  placeholder="Qty (e.g. 2)"
                  className="form-input"
                  style={{ width: '110px', flexShrink: 0 }}
                  value={ing.amount}
                  onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Unit (cups, tbsp)"
                  className="form-input"
                  style={{ width: '130px', flexShrink: 0 }}
                  value={ing.unit}
                  onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Ingredient name (e.g., Fresh Rosemary)"
                  className="form-input"
                  style={{ flexGrow: 1 }}
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                />
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => removeIngredientRow(idx)}
                  disabled={ingredients.length <= 1}
                  title="Remove ingredient"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </section>

          {/* Section 3: Dynamic Instructions */}
          <section className="form-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <h2 className="section-title">3. Cooking Instructions</h2>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={addStepRow}
              >
                <Plus size={15} />
                <span>Add Step</span>
              </button>
            </div>
            <p className="section-desc">Sequential preparation instructions that guide the cook step-by-step.</p>

            {steps.map((step, idx) => (
              <div key={idx} className="dynamic-row" style={{ alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    flexShrink: 0,
                    marginTop: '6px',
                  }}
                >
                  {idx + 1}
                </div>
                <textarea
                  rows={2}
                  placeholder={`Step ${idx + 1} instruction...`}
                  className="form-textarea"
                  style={{ flexGrow: 1 }}
                  value={step.instruction}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                />
                <button
                  type="button"
                  className="btn-icon"
                  style={{ marginTop: '6px' }}
                  onClick={() => removeStepRow(idx)}
                  disabled={steps.length <= 1}
                  title="Remove step"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </section>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <Link to={isEdit ? `/recipes/${id}` : '/'} className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
            >
              <Save size={18} />
              <span>{submitting ? 'Saving Recipe...' : isEdit ? 'Update Recipe' : 'Publish Recipe'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
