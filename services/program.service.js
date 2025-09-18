const admin = require("../config/firebase");
const db = admin.firestore();

const createProgram = async (userId, input) => {
  const program = {
    ...input,
    userId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await db.collection("programs").add(program);
  const doc = await docRef.get();

  return { id: doc.id, ...doc.data() };
};

const getProgramsByUser = async (userId) => {
  const query = db.collection("programs").where("userId", "==", userId);
  const snapshot = await query.get();
  const programs = [];

  snapshot.forEach((doc) => {
    programs.push({ id: doc.id, ...doc.data() });
  });

  return programs;
};

const getAllProgramsPublic = async () => {
  const snapshot = await db.collection("programs").get();
  const programs = [];

  snapshot.forEach((doc) => {
    programs.push({ id: doc.id, ...doc.data() });
  });

  return programs;
};

const getProgramById = async (userId, params) => {
  const { id: programId } = params;

  try {
    const docRef = db.collection("programs").doc(programId);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== userId) {
      return null;
    }

    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw error;
  }
};

const getProgramByIdPublic = async (params) => {
  const { id: programId } = params;

  try {
    const docRef = db.collection("programs").doc(programId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw error;
  }
};

const updateProgramById = async (userId, params, input) => {
  const { id: programId } = params;

  try {
    const docRef = db.collection("programs").doc(programId);
    const doc = await docRef.get();

    if (!doc.exists) {
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

const deleteProgramById = async (userId, params) => {
  const { id: programId } = params;

  try {
    const docRef = db.collection("programs").doc(programId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return false;
    }

    await docRef.delete();
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProgram,
  getProgramsByUser,
  getAllProgramsPublic,
  getProgramById,
  getProgramByIdPublic,
  updateProgramById,
  deleteProgramById,
};
