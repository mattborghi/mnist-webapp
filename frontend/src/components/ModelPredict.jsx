import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

//Model and metadata URL
const url = {
  model:
    "https://raw.githubusercontent.com/mattborghi/mnist-webapp/main/model/content/model.json",
};

function ModelPredict() {
  // const [metadata, setMetadata] = useState();
  const [model, setModel] = useState();

  async function loadModel(url) {
    try {
      const model = await tf.loadLayersModel(url.model);
      setModel(model);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel(url);
    });
  }, []);

  const runModel = (data, setPrediction) => {
    // wait for the model to be defined
    if (model) {
      model
        .predict([tf.tensor(data).reshape([1, 28, 28, 1])])
        .array()
        .then(function (scores) {
          scores = scores[0];
          var predicted = scores.indexOf(Math.max(...scores));
          console.log(
            "predicted: ",
            predicted,
            " with probability: ",
            Math.max(...scores),
            "%"
          );
          setPrediction(predicted);
        });
    } else {
      // The model takes a bit to load, if we are too fast, wait
      setTimeout(function () {
        runModel(data);
      }, 50);
    }
  };

  return [runModel];
}

export default ModelPredict;
