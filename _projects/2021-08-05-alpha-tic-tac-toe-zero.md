---
title: "Alpha Tic-tac-toe Zero"
excerpt: "Combine reinforcement learning and Monte Carlo tree search together, which is amazing!"
categories:
tags: Reinforcement-Learning Monte-Carlo-Tree-Search
---

### Playground

Welcome to play the game of Tic-tac-toe with my [AlphaZero agent](https://github.com/Te-YuanLiu/alpha-zero)!

Note that it may take a minute for the agent to wake up from idling, so please be patient.

<iframe src="https://teyuanliu.github.io/tic_tac_toe/" title="Tic-tac-toe Game" height="600px" width="100%"></iframe>

### Introduction

This Tic-tac-toe game has two modes, easy and hard, each backed by an Alpha Tic-tac-toe Zero agent. Players also have the option to go first or second in the game!

Alpha Tic-tac-toe Zero, is an agent trained for the game of Tic-tac-toe, using a simplified implementation of the policy iteration algorithm (a type of reinforcement learning) presented in DeepMind's [AlphaGo
Zero](https://deepmind.com/blog/article/alphago-zero-starting-scratch) paper.

### Methods

The following is a brief description of the policy iteration algorithm.

Firstly in the initialization stage, we start with a neural network with random weights so it is a random policy and value network. Next, we repeat the following iteration procedure.

Each iteration consists of two steps: the policy evaluation and the policy improvement step.

In the policy evaluation step, we aim to evaluate our policy by finding the value function, here it means the chance of winning given a game state (board configuration). To find the value function we let the agent play a number of self-play games. In each turn of a game, we perform a fixed number of MCTS simulations from the current state $$s_t$$ to get the MCTS-improved policy $$\vec \pi_t$$, and then sample from that policy to choose a move. Therefore, each turn produces a tuple $$(s_t, \vec \pi_t, \_)$$ as a training example. At the end of the game, the value $$\_$$ is filled in as +1 if the current player wins, else -1.

Then, in the policy improvement step, we make a copy of the current neural network as the new network and train it with the examples obtained in the previous step. Next, we let the new network play against the old one in a series of games. If the new network wins more than 55% of the games, the network is updated to the new one. Otherwise, the new network is rejected and the old one remains.

Following this scenario, the agent gradually picks up strategies to defeat previous incarnations of itself and continues to advance. We rerun the above iteration until the new network is rejected for more than a set number of times, implying the learning has converged and there is not much room left for improvement.

This pretty much summarizes the learning algorithm of AlphaGo Zero in a very high-level. I recommend reading the original paper to understand more about this elegant, simple but powerful algorithm.

### References

- [A Simple Alpha(Go) Zero Tutorial](https://web.stanford.edu/~surag/posts/alphazero.html)

- [How to build your own AlphaZero AI using Python and Keras](https://medium.com/applied-data-science/how-to-build-your-own-alphazero-ai-using-python-and-keras-7f664945c188)
