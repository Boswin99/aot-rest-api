const admin = require("../config/firebase");
const db = admin.firestore();

const createTour = async (userId, input) => {
  const tour = {
    ...input,
    userId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await db.collection("tours").add(tour);
  const doc = await docRef.get();

  return { id: doc.id, ...doc.data() };
};

const getToursByUser = async (userId) => {
  const query = db.collection("tours").where("userId", "==", userId);
  const snapshot = await query.get();
  const tours = [];

  snapshot.forEach((doc) => {
    tours.push({ id: doc.id, ...doc.data() });
  });

  return tours;
};

const getAllToursPublic = async () => {
  const snapshot = await db.collection("tours").get();
  const tours = [];

  snapshot.forEach((doc) => {
    tours.push({ id: doc.id, ...doc.data() });
  });

  return tours;
};

const getTourById = async (userId, params) => {
  const { id: tourId } = params;

  try {
    const docRef = db.collection("tours").doc(tourId);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== userId) {
      return null;
    }

    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw error;
  }
};

const getTourByIdPublic = async (params) => {
  const { id: tourId } = params;

  try {
    const docRef = db.collection("tours").doc(tourId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw error;
  }
};

const updateTourById = async (userId, params, input) => {
  const { id: tourId } = params;

  try {
    const docRef = db.collection("tours").doc(tourId);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== userId) {
      return null;
    }

    const updateData = {
      ...input,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.update(updateData);

    // Get the updated document
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  } catch (error) {
    throw error;
  }
};

const deleteTourById = async (userId, params) => {
  const { id: tourId } = params;

  try {
    const docRef = db.collection("tours").doc(tourId);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== userId) {
      return false;
    }

    await docRef.delete();
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTour,
  getToursByUser,
  getAllToursPublic,
  getTourById,
  getTourByIdPublic,
  updateTourById,
  deleteTourById,
};
