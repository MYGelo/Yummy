import React, { useState, useEffect } from 'react';
import { Formik, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import ImageUploading from 'react-images-uploading';
import {
  StyledForm,
  UploadBtn,
  Info,
  Desc,
  DescField,
  DescLabel,
  DescSelect,
  Input,
  Error,
  FormTitle,
  IngredientsHeader,
  QtySelector,
  IngredientContainer,
  Ingredient,
  Preparation,
  Instructions,
  ImageWrapper,
  IngredientsList,
  InstructionsError,
} from './AddRecipeForm.styled';
import { getIngredients, getCategories } from 'api/addRecipe';
import Icon from 'components/IconComponent/Icon';

const timeOptions = [
  { value: '30 min', label: '30 min' },
  { value: '60 min', label: '60 min' },
  { value: '90 min', label: '90 min' },
];

const measureOptions = [
  { value: 'tbs', label: 'tbs' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
];

const AddRecipeForm = () => {
  const [image, setImage] = useState(null);
  const [ingredientsQty, setIngredientsQty] = useState(3);
  const [ingredients, setIngredients] = useState(
    Array.from({ length: ingredientsQty }, (_, i) => {
      return { id: '', name: '', measure: '' };
    })
  );
  const [ingredientsList, setIngredientsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const runEffect = async () => {
      try {
        const fetchedIngredientsList = await getIngredients();
        const fetchedCategoriesList = await getCategories();

        setIngredientsList(fetchedIngredientsList);
        setCategoriesList(fetchedCategoriesList);
      } catch (error) {
        console.log(error);
      }
    };
    runEffect();
  }, []);

  const onChange = imageList => {
    setImage(imageList[0]);
  };

  const categoriesOptions = categoriesList.map(ctg => {
    return { value: ctg._id, label: ctg.name };
  });

  const ingredientsOptions = ingredientsList.map(i => {
    return { value: i._id.$oid, label: i.name };
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(false);
  };

  const handleDeleteIngredient = i => {
    setIngredients(ingredients => ingredients.filter(ingr => ingr !== i));
  };

  const validateForm = values => {
    const errors = {};

    if (!values.title) {
      errors.title = 'Please enter a title for the recipe';
    }

    if (!values.description) {
      errors.description = 'Please enter a description for the recipe';
    }

    if (!values.ingredients || values.ingredients.length === 0) {
      errors.ingredients = 'Please enter at least one ingredient';
    }

    // if (!values.instructions) {
    //   errors.instructions = 'Please enter the recipe instructions';
    // }

    return errors;
  };

  return (
    <Formik
      initialValues={{
        thumb: null,
        title: '',
        description: '',
        category: '',
        time: '',
        ingredients,
        instructions: '',
      }}
      validate={validateForm}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => {
        values.thumb = image ? image.dataURL : null;

        return (
          <StyledForm>
            <Info>
              <div>
                <ImageUploading onChange={onChange}>
                  {({ onImageUpdate }) => (
                    <ImageWrapper onClick={onImageUpdate}>
                      {image ? (
                        <img src={values.thumb} alt="" />
                      ) : (
                        <UploadBtn>
                          <Icon name="camera" width="64" height="64" />
                        </UploadBtn>
                      )}
                    </ImageWrapper>
                  )}
                </ImageUploading>
              </div>
              <Desc>
                <DescField>
                  <DescLabel htmlFor="title">Enter item title</DescLabel>
                  <Input type="text" id="title" name="title" />
                  <ErrorMessage name="title" component={Error} />
                </DescField>

                <DescField>
                  <DescLabel htmlFor="description">
                    Enter about recipe
                  </DescLabel>
                  <Input id="description" name="description" />
                  <ErrorMessage name="description" component={Error} />
                </DescField>

                <DescField>
                  <DescLabel>Category</DescLabel>
                  <DescSelect
                    id="category"
                    name="category"
                    options={categoriesOptions}
                    onChange={selected => (values.category = selected.value)}
                  />
                </DescField>

                <DescField>
                  <DescLabel>Cooking time</DescLabel>
                  <DescSelect
                    id="time"
                    options={timeOptions}
                    onChange={selected => (values.time = selected.value)}
                  />
                </DescField>
              </Desc>
            </Info>

            <div>
              <IngredientsHeader>
                <FormTitle>Ingredients</FormTitle>
                <QtySelector>
                  <span
                    onClick={() => setIngredientsQty(prevQty => prevQty - 1)}
                  >
                    -
                  </span>
                  <span>{ingredientsQty}</span>
                  <span
                    onClick={() => setIngredientsQty(prevQty => prevQty + 1)}
                  >
                    +
                  </span>
                </QtySelector>
              </IngredientsHeader>
              <IngredientsList>
                {Array.from({ length: ingredientsQty }, (_, i) => (
                  <IngredientContainer key={i}>
                    <Ingredient
                      id={`ingredients[${i}]`}
                      options={ingredientsOptions}
                      onChange={selected => {
                        values.ingredients[i] = {
                          id: selected.value,
                          name: selected.label,
                        };
                        console.log(values);
                      }}
                    />
                    <ErrorMessage
                      name={`ingredientsError[${i}]`}
                      component={Error}
                    />

                    <Select
                      id={`measure[${i}]`}
                      options={measureOptions}
                      onChange={selected => {
                        values.ingredients[i].measure = selected.value;
                        console.log(values);
                      }}
                    />
                    <ErrorMessage
                      name={`measureError[${i}]`}
                      component={Error}
                    />

                    <button type="button">X</button>
                  </IngredientContainer>
                ))}
              </IngredientsList>
            </div>

            <Preparation>
              <FormTitle htmlFor="instructions">Recipe Preparation</FormTitle>
              <Instructions
                as="textarea"
                id="instructions"
                name="instructions"
                placeholder="Enter recipe"
                rows="5"
              />
              <ErrorMessage name="instructions" component={InstructionsError} />
            </Preparation>

            <button type="submit" disabled={isSubmitting}>
              Add Recipe
            </button>
          </StyledForm>
        );
      }}
    </Formik>
  );
};

export default AddRecipeForm;
