const functions = require('firebase-functions');


const admin = require('firebase-admin');
//const Collections = makeEnum(["CookingRequests","green","blue"]);
admin.initializeApp();

// exports.addMessage = functions.https.onRequest((req, res) => {
//       const original = req.query.text;
//       return admin.firestore().collection('messages').add({original: original}).then((writeResult) => {
//         // Send back a message that we've succesfully written the message
//         return res.json({result: `Message with ID: ${writeResult.id} added.`});
//       });

//     });


// exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
//     .onCreate((snap, context) => {
//         const original = snap.data().original;
//         console.log('Uppercasing', context.params.documentId, original);
//         const uppercase = original.toUpperCase();
//         return snap.ref.set({uppercase}, {merge: true});
//     });


exports.incomingCookingRequest = functions.firestore.document('/CookingRequests/{userId}/SelectedRecipes/{documentId}')
.onCreate((snap,context) => {
    const createdValue = snap.data();
    const recipeArr = Array.from(createdValue.Recipes);


    console.log("Created value id: "+ createdValue.toString() + "\n the recipeArr is: "+recipeArr);

    const fullRecipesCollectionRef = admin.firestore().collection('FullRecipes');
    const fullRecipesPromises = [];

    recipeArr.forEach(val => {
        fullRecipesPromises.push(fullRecipesCollectionRef.doc(val.toString()).get());
    });

    return Promise.all(fullRecipesPromises)
    .then(querySnapshot => {
        querySnapshot.forEach(snapElement => {
            const fullRecipe = snapElement.data();
            console.log("The full recipe is: \n" + JSON.stringify(fullRecipe));
        });
        return;
    })
    .catch(err => console.log(err));
});



// function makeEnum(arr){
//     let obj = {};
//     for (let val of arr){
//         obj[val] = Symbol(val);
//     }
//     return Object.freeze(obj);
// }


