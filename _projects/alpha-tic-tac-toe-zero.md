---
title: "Alpha Tic-Tac-Toe Zero"
excerpt: "Combine reinforcement learning and Monte Carlo tree search together! That's amazing!"
categories:
tags: Reinforcement-Learning Monte-Carlo-Tree-Search
---

### Playground

Welcome to play the game of Tic-Tac-Toe against my Alpha Tic-Tac-Toe Zero agent!

You as the challenger will use the "X" stone while the agent will use the "O" stone.

Click on the board and let's go!

<div id="app"></div>
<link rel="stylesheet" href="/css/alpha.css" class="rel" />
<script src="/js/alpha.bundle.js" defer="defer"></script>

### Introduction

Alpha Tic-Tac-Toe Zero, is an agent trained for the game Tic-Tac-Toe, using a simplified implementation of the policy iteration algorithm (a type of reinforcement learning) presented in DeepMind's [AlphaGo
Zero](https://deepmind.com/blog/article/alphago-zero-starting-scratch) paper. My code is accessible [here](https://github.com/Te-YuanLiu/alpha-zero).

The policy iteration algorithm works as follows. Firstly in the initialization stage, we start with a neural network with random weights so it is a random policy and value network. Next, we repeat the following iteration procedure.

Each iteration consists of two steps: the policy evaluation and the policy improvement step.

In the policy evaluation step, we aim to evaluate our policy by finding the value function, here it means the chance of winning given a game state (board configuration). To find the value function we let the agent play a number of self-play games. In each turn of a game, we perform a fixed number of MCTS simulations from the current state $$s_t$$ to get the MCTS-improved policy $$\vec \pi_t$$, and then sample from that policy to choose a move. Therefore, each turn produces a tuple $$(s_t, \vec \pi_t, \_)$$ as a training example. At the end of the game, the value $$\_$$ is filled in as +1 if the current player wins, else -1.

Then, in the policy improvement step, we make a copy of the current neural network as the new network and train it with the examples obtained in the previous step. Next, we let the new network play against the old one in a series of games. If the new network wins more than 55% of the games, the network is updated to the new one. Otherwise, the new network is rejected and the old one remains.

Following this scenario, the agent gradually picks up strategies to defeat previous incarnations of itself and continues to advance. We rerun the above iteration until the new network is rejected for more than a set number of times, implying the learning has converged and there is not much room left for improvement.

This pretty much summarizes the learning algorithm of AlphaGo Zero in a very high-level. I recommend reading the original paper to understand more about this elegant, simple but powerful algorithm.

### References

- [A Simple Alpha(Go) Zero Tutorial](https://web.stanford.edu/~surag/posts/alphazero.html)

- [How to build your own AlphaZero AI using Python and Keras](https://medium.com/applied-data-science/how-to-build-your-own-alphazero-ai-using-python-and-keras-7f664945c188)