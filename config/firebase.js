// const admin = require("firebase-admin");

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: "tea-university",
//       clientEmail: "firebase-adminsdk-fbsvc@tea-university.iam.gserviceaccount.com",
//       privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDkIXIOCq0Lrau7\ndrVYLpASfxfAEjv8uXycuYrVQnjkfNkxhkN5ZNtSoYrX839/ocDEmj9KhBLis7qE\nbb40RjgMZXfXsoQQd9WqNBoT9QPhBnePNi/rRUL2vwiAByMpHhZTasBNg3SCLQlf\nu8tck4jZ81SFOJno/MeyD4Tni1On+3cyhS9j6uXqg6oughH0xTAjyvCHxa40OBD0\n6JtP40anBNrmsqDfTbjnb2bY4Bvh+r5HLiLwzCCuJT3s9vO2YSWlpCtn4k/K5VLD\nQnHugKqNR5ogtnaFY1Aw/fMuHGB15YviAVeF0n0bN7AiPBLbgh4IFNc3434dagIF\nsG+mAZutAgMBAAECggEANBSElrsONU/RGEtp6/c5Udes4t7mzfPEhH0BOl1h/vuX\nk+xMZB7HyS3y5gkDTu5s9RUnpMnRC+svBgONvB5Ztk7F1Lq+1omdAC3D1FGHsKwK\nyGl8+A+IUY9cD+pRNxZUz3db7nY3t24zqSTUsM5HnEYmQgGhdWSb7EUJuNiAYSUj\nXIIc1os8KO5BYuuNcT/dP2WFRU3dXIALb2e5M5ryNOn1IyCMF1JDbzu4YNQYmT+h\nAMBYyQSLWKHc+LkVKDYcyip9WbPgEWICwItsQuk1wmHVmAqDI+T3cDBbDJsLuXHC\nNSeLzjW5icyfx3ETEJxkG/gZBcxRMG/Ps1/0xPRmYQKBgQD+gGMju6NY79csaG2M\nyiK6BKRpy6ZhdQb3UKVo51/Ao16barEenZ7QkKMt0UnDyk2Oca/z7gE2N4nsxitN\nEHlrBIgn5IEqElQksF4ggUGJOzO4EzkqsfRABZy3q5ErWN5eiXC9J5PNARDtYQhm\nNbYcLJm2pWfjXFyaDgTRXELYfQKBgQDleU8m04Z2fAgAeE4XUepPDcL0+zlJtkde\n5cjlrcQt1lZ4EVF4rUke8pHh4ESBZDvig2Yd8gb1kKdrw/1RBYx6byiqrikfZxou\nntG44VNGY51KO4yfygVs3zcwC+fqX+Ee3zQlio+OjEJVR7GMXYf2l6jdLOZos4j1\nlHx3trpm8QKBgHlEu/i+5CrwvdsPN4QqnTl+FMnEnFc76EHYT7kY5utn7SCpShSI\njrBa+yZN35RHxYTmby0Qb8th03rbQq7J9tEjq602mMVvTmDdGTzr2kqFxzMjFc5e\nVUBcbDyop9e71Nm/K9U2EptQsrwpzFLHrSrnpab+Ue5oiEdv/qO0DrYRAoGBAIML\nfcocbeNn/WHXUjE7FGXE5BrnBNY1hBiLfOi9DRVoG8VBjpctzl4gBHNLkZOa3CAF\nDeH3/0VpMFL4f8cvNgQNStn9z3ohdPA+vmGoO9gstvxXeX0e7243ItsLUYuk6Xip\n2qu9rzGmo5Lz+E7Ccwy9my+DnqkYLhSgkVwEO/rhAoGBAM/BswIIDuwQWbqTTNSe\nVy00CfUXCszBpZ2NTfB/nYqgCKiaIIT33Ul4ScVjmiMuEmqWQAt57YyiPEM3HJ1S\nzXetf/B8DZz4RGbtQClnhYyJH2B0gam56SalcPxyqA0bqhMHivTuu4M96tGoXV/+\nMukO3YizVu1yFtRGN3UriTOG\n-----END PRIVATE KEY-----\n",
//     }),
//   });
// }

// module.exports = admin;


const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;