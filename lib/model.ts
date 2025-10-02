// import * as tf from "@tensorflow/tfjs-node";

// let model: tf.LayersModel | null = null;

// export async function loadModel() {
//   if (!model) {
//     // For prototype: build a tiny autoencoder-like network
//     model = tf.sequential();
//     model.add(tf.layers.dense({ inputShape: [5], units: 4, activation: "relu" }));
//     model.add(tf.layers.dense({ units: 5, activation: "linear" }));
//     model.compile({ optimizer: "adam", loss: "meanSquaredError" });

//     // Train a dummy model with random data so weights are initialized
//     const dummyX = tf.randomNormal([100, 5]);
//     await model.fit(dummyX, dummyX, { epochs: 5, verbose: 0 });
//   }
//   return model;
// }

// /**
//  * Computes risk score using reconstruction error
//  */
// export async function getRiskScore(model: tf.LayersModel, features: number[], baseline: number[]) {
//   const input = tf.tensor2d([features]);
//   const output = model.predict(input) as tf.Tensor;
//   const error = tf.losses.meanSquaredError(input, output).dataSync()[0];

//   // Normalize risk score: higher error = higher risk
//   const normalized = Math.min(error / 0.05, 1); // Adjust divisor based on training
//   return normalized;
// }
