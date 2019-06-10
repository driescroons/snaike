# [Snaike](https://snaike.dries.io) 👈 click me

Snaike is a browser trained snake neural network that learns to play, you couldn't have guessed it, snake. I hacked something together over the weekend and figured I'd post it online! It's made using **Typescript**, **Tensorflow**, **HTML5s Canvas Element** and **React**.

I'd love for you to **contribute** to the Snaike Repository as I'm looking to elaborate on this (and maybe even write a full tutorial for this). Are you looking for a side project and want to help me out? [📧](https://twitter.com/croewens)

Please note that this project is most definitely not finished yet.

![](https://i.imgur.com/x7JOTCr.gif)

# Explanation

For snaike, I've created a neural network based on a genetic algorithm.

## What is a neural network?

> [A neural network is a kind of algorithm that can be used to determine the abstract relationship between some input data and a desired output. ](https://becominghuman.ai/designing-ai-solving-snake-with-evolution-f3dd6a9da867)

For snaike, I went with 13 inputs. For every direction, being up / right / down / left, we check if there is a collision if you'd move one block, wether we would be able to eat the food on that block, and if the food is in that general direction. The last input we provide is a relative, normalized angle from the snakes head to the food.

The output of the neural network gives us one of 4 possible directions.

## What is a genetic algorithm?

> [Instead of picking a network type and then slowly training it based on example Snake gameplay, we are going to create a scenario for one to evolve on its own.](https://becominghuman.ai/designing-ai-solving-snake-with-evolution-f3dd6a9da867)

All connections within the neural network will be build up randomly though multiple generations of the application. We reward the snake based on its actions by giving them points. These Points add up to its score and they can be obtained by eating or moving closer to the food. At the end of each generation (when the full population dies), we mutate the snakes their "brains" so that they more closesly mimic the best snakes of that specific generation, the ones who'd gotten the most points.

# Getting started

Running the application is fairly easy. Clone the package and run

`yarn`

Once the packages are installed, run

`yarn dev`

# Stack

- Typescript
- Tensorflow
- HTML5s canvas element
- React

# References

I initially stumbled upon [Desigining AI: Solving Snake with Evolution](https://becominghuman.ai/designing-ai-solving-snake-with-evolution-f3dd6a9da867) from Peter Binggeser. A really nice article where he explains step by step how you should design a neural network, one specifically for snake. Upon scrolling through the [repository](https://github.com/pbinggeser/snake-ai), I felt it was a little outdated so I decided to see if I could build it from scratch using a more modern approach. (newer packages...) I've used some of his quotes above.

I've scrolled through many projects during the creation and I most definitely wouldn't have been able to create snaike if wasn't for all of the awesome articles, repositories, videos from everyone here underneath! If you're looking to create something similar, make sure to checkout the following repositories as well:

- https://github.com/Llang8/snake-ai
- https://towardsdatascience.com/train-ai-to-play-snake-in-your-browser-ca657097d707
- https://github.com/ldcorentin/Snake-AI
- https://www.youtube.com/watch?v=zIkBYwdkuTk
- https://github.com/Lund259/Neural-Network-Plays-Snake/
- https://github.com/Acidic9/snake-ai
- https://github.com/DiogoRamos22/Snake_AI
- https://github.com/guiconti/snake_tensorflowjs

Vector library used:

- https://gist.github.com/sbrl/69a8fa588865cacef9c0

# Roadmap

- Better state management
- Refactoring / Cleaning up
- Choose your inputs

# Contact

Feel free to contact me on twitter [@croewens](https://twitter.com/croewens) or on my [website](https://dries.io) if you have any questions.
