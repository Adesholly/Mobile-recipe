const mealsElement = document.getElementById('meals');
const favContainer = document.getElementById('fav-meals');

const searchTerm = document.getElementById('search-term');
const searchBtn  = document.getElementById('search');

getRandomMeal(); 
fetchFavMeals();


async function getRandomMeal() {
    const fetchData = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    const response = await fetchData.json();
    const responseData = response.meals[0];

    addMeal(responseData, true);


}

async function getMealById(id) {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);

    const responseData = await response.json();
    const meal = responseData.meals[0];

    return meal;


}

async function getMealBySearch(term) {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);
    
    const responseData = await response.json();

    const meals = responseData.meals;
    
    return meals;

    

} 


function addMeal(mealData, random = false) {
    console.log(mealData);
    const meal = document.createElement('div');

    meal.classList.add('meal')

    meal.innerHTML = `
                <div class="meal-header">
                ${random ? `
                    <span class="random">Random Recipe</span>` : ''
        }
                    <img src="${mealData.strMealThumb}" alt="${mealData.Meal}">
                </div>
                <div class="meal-body">
                    <h4>${mealData.strMeal}</h4>
                    <button class="fav-btn">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
              `;
    const btn = meal.querySelector('.meal-body .fav-btn');
    btn.addEventListener('click', () => {

       if(btn.classList.contains('active')) {
           removeMealFromLS(mealData.idMeal);
           btn.classList.remove("active");

       }else{
           addMealToLS(mealData.idMeal);
           btn.classList.add("active");
       }
        fetchFavMeals();
    });
    meals.appendChild(meal);
}


function addMealToLS(mealId) {
    const mealIds = getMealFromLS();

    localStorage.setItem(
        "mealIds", JSON.stringify([...mealIds, mealId]));

}


function getMealFromLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;

}

function removeMealFromLS(mealId) {

    const mealIds = getMealFromLS();

    localStorage.setItem(
        "mealIds", JSON.stringify(mealIds.filter((id) => id !== mealId))
        
        );
}

async function fetchFavMeals(){
     
    //Clean the container
    favContainer.innerHTML = "";
    const mealIds = getMealFromLS();
    const meals = [];

    for(let i=0; i < mealIds.length; i++){

        const mealId = mealIds[i];
        meal =  await getMealById(mealId);
        
        addMealToFav(meal);

    }

}


function addMealToFav(mealData){
    const favMeal = document.createElement("li");

    favMeal.innerHTML = `
    <img 
    src="${mealData.strMealThumb}" 
    alt="${mealData.Meal}"/>
    <span>${mealData.strMeal}</span>
    <button class="clear">
        <i class="fas fa-window-close"></i>
    </button>

      
    `;
    const btn = favMeal.querySelector('.clear');

    btn.addEventListener('click', () => {
        removeMealFromLS(mealData.idMeal);

        fetchFavMeals();
    });

    favContainer.appendChild(favMeal);
}

searchBtn.addEventListener('click', async () => {
     
    mealsElement.innerHTML = '';
    const search = searchTerm.value;
    const meals = await getMealBySearch(search);

    if(meals == null){
        alert('Not Found');
        
    }else {
        meals.forEach((meal)=> {
            addMeal(meal);

            });
        }
    

});
