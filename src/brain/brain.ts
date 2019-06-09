import * as tf from "@tensorflow/tfjs";
import { directions } from "../snake/snake";

var seeded = false;
var previous = false;
var y2 = 0;

var lcg = (function() {
  // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
  // m is basically chosen to be large (as it is the max period)
  // and for its relationships to a and c
  var m = 4294967296,
    // a - 1 should be divisible by m's prime factors
    a = 1664525,
    // c and m should be co-prime
    c = 1013904223,
    seed: number,
    z: number;
  return {
    setSeed: function(val: number) {
      // pick a random seed if val is undefined or null
      // the >>> 0 casts the seed to an unsigned 32-bit integer
      z = seed = (val == null ? Math.random() * m : val) >>> 0;
    },
    getSeed: function() {
      return seed;
    },
    rand: function() {
      // define the recurrence relationship
      z = (a * z + c) % m;
      // return a float in [0, 1)
      // if z = m then z / m = 0 therefore (z % m) / m < 1 always
      return z / m;
    }
  };
})();

export function random(min?: number | number[], max?: number | number[]) {
  var rand;

  if (seeded) {
    rand = lcg.rand();
  } else {
    rand = Math.random();
  }
  if (typeof min === "undefined") {
    return rand;
  } else if (typeof max === "undefined") {
    if (min instanceof Array) {
      return min[Math.floor(rand * min.length)];
    } else {
      return rand * min;
    }
  } else if (typeof min === "number" && typeof max === "number") {
    if (min > max) {
      var tmp = min;
      min = max;
      max = tmp;
    }

    return rand * (max - min) + min;
  }

  return -1;
}

function randomGaussian(mean?: number, sd?: number) {
  var y1, x1, x2, w;
  if (previous) {
    y1 = y2;
    previous = false;
  } else {
    do {
      x1 = random(2) - 1;
      x2 = random(2) - 1;
      w = x1 * x1 + x2 * x2;
    } while (w >= 1);
    w = Math.sqrt((-2 * Math.log(w)) / w);
    y1 = x1 * w;
    y2 = x2 * w;
    previous = true;
  }

  var m = mean || 0;
  var s = sd || 1;
  return y1 * s + m;
}

export class NeuralNetwork {
  private model: tf.Sequential;
  private inputNodes: number;
  private hiddenNodes: number;
  private outputNodes: number;

  constructor(a: number | tf.Sequential, b: number, c: number, d?: number) {
    if (a instanceof tf.Sequential && d != null) {
      this.model = a;
      this.inputNodes = b;
      this.hiddenNodes = c;
      this.outputNodes = d;
    } else if (typeof a === "number") {
      this.inputNodes = a;
      this.hiddenNodes = b;
      this.outputNodes = c;
      this.model = this.createModel();
    } else {
      throw new Error("bad arguments");
    }
  }

  public copy() {
    let copy!: NeuralNetwork;
    tf.tidy(() => {
      const modelCopy = this.createModel();
      const weights = this.model.getWeights();
      const weightCopies = [];
      for (let i = 0; i < weights.length; ++i) {
        weightCopies[i] = weights[i].clone();
      }
      modelCopy.setWeights(weightCopies);
      copy = new NeuralNetwork(modelCopy, this.inputNodes, this.hiddenNodes, this.outputNodes);
    });
    return copy;
  }

  public mutate(rate: number) {
    tf.tidy(() => {
      const weights = this.model.getWeights();
      const mutatedWeights = [];
      for (let i = 0; i < weights.length; ++i) {
        let tensor = weights[i];
        let shape = weights[i].shape;
        let values = tensor.dataSync().slice();
        for (let j = 0; j < values.length; ++j) {
          if (random(1) < rate) {
            let w = values[j];
            values[j] = w + randomGaussian();
          }
        }
        let newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
      this.model.setWeights(mutatedWeights);
    });
  }

  public dispose() {
    this.model.dispose();
  }

  public static load(name: string) {
    return tf.loadLayersModel(`localstorage://${name}`);
  }

  public save(name: string) {
    return this.model.save(`localstorage://${name}`);
  }

  public predict(inputs: number[]) {
    return tf.tidy(() => {
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs) as tf.Tensor;
      return directions[ys.argMax(1).dataSync()[0]] as any;
    });
  }

  private createModel() {
    const model = tf.sequential();
    const hiddenOne = tf.layers.dense({
      units: this.hiddenNodes,
      inputShape: [this.inputNodes],
      activation: "relu"
    });
    model.add(hiddenOne);
    // const hiddenTwo = tf.layers.dense({
    // 	units: 15,
    // 	activation: 'relu',
    // })
    // model.add(hiddenTwo)
    const output = tf.layers.dense({
      units: this.outputNodes,
      activation: "softmax"
    });
    model.add(output);
    return model;
  }
}
