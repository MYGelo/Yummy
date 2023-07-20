import { instance } from 'api/APIconfig';
import { createAsyncThunk } from '@reduxjs/toolkit';

// ADD NEW RECIPE
export const addRecipe = createAsyncThunk(
  'recipes/addRecipe',
  async (body, thunkAPI) => {
    try {
      const { data } = await instance.post('recipes', body);
      console.log(` ADD NEW RECIPE`, data);
      window.location.reload()
      return { ...body, ...data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// DELETE RECIPE
export const deleteRecipe = createAsyncThunk(
  'recipes/deleteRecipe',
  async (recipeId, thunkAPI) => {
    try {
      const { data } = await instance.delete(`recipes/${recipeId}`);
      console.log(`DELETE RECIPE`, data);
      window.location.reload()
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// GET MY RECIPE LIST - add by Oleg.
export const getRecipeList = createAsyncThunk(
  'ownRecipes',
  async (_, thunkAPI) => {
    try {
      const { data } = await instance.get(`ownRecipes`);
      console.log(`GET MY RECIPE LIST `, data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// GET RECIPEBYID
export const getRecipeById = createAsyncThunk(
  'recipes/getRecipeById',
  async ({ recipeId }, thunkAPI) => {
    try {
      const { data } = await instance.get(`recipes/${recipeId}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// GET POPULAR RECIPES
export const getPopularRecipes = createAsyncThunk(
  'recipes/popular',
  async (_, thunkAPI) => {
    try {
      const { data } = await instance.get(`recipes/popular`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

