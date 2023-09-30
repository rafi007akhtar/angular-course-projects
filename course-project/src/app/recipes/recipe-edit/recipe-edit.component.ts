import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../recipes.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  isFormChanging = false;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params.id;
      this.editMode = !!(this.id + 1);
      this.initForm();
    });
    this.recipeForm.valueChanges.subscribe(() => {
      this.isFormChanging = true;
    });
  }

  onSubmit() {
    console.log(this.recipeForm);
    if (this.editMode) {
      this.recipeService.updateExistingRecipe(
        this.id,
        this.recipeForm.value as Recipe
      );
    } else {
      this.recipeService.addNewRecipe(this.recipeForm.value as Recipe);
    }
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onCancel() {
    let confirmCancel = true;
    if (this.isFormChanging) {
      confirmCancel = confirm(
        'Your changes are unsaved. Do you want to cancel?'
      );
    }
    if (confirmCancel) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  initForm() {
    const recipe = this.editMode
      ? this.recipeService.getRecipeFromIndex(this.id)
      : undefined;

    const recipeIngredients = new FormArray([]);
    if (recipe?.ingredients && recipe.ingredients.length) {
      for (let ingredient of recipe.ingredients) {
        recipeIngredients.push(
          new FormGroup({
            name: new FormControl(ingredient.name, Validators.required),
            amount: new FormControl(ingredient.amount, [
              Validators.required,
              Validators.min(1),
            ]),
          })
        );
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipe?.name || '', Validators.required),
      imagePath: new FormControl(recipe?.imagePath || '', Validators.required),
      description: new FormControl(
        recipe?.description || '',
        Validators.required
      ),
      ingredients: recipeIngredients,
    });
  }

  addNewIngredient() {
    this.ingredients.push(
      new FormGroup({
        name: new FormControl('', Validators.required),
        amount: new FormControl('', [Validators.required, Validators.min(1)]),
      })
    );
  }

  deleteIngredient(ind: number) {
    this.ingredients.removeAt(ind);
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }
}
