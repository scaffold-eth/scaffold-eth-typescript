
# Graph-Node & Subgraph

1.  In root folder In first start, just run.

      ```bash
      yarn run-graph-node
      ```

      Note: Sometimes you need remove the old containers before run it.

      `Windows users` using WSL may need run `sudo` before `yarn clean-graph-node`.

      ```bash
      yarn clean-graph-node
      yarn run-graph-node
      ```

2. After graph node is running, build and add subgraph inside.

      Note: `yarn graph-remove-local` can be useful

      ```bash
      yarn graph-create-local
      ```

      To just deploy it you can run:

      ```bash
      yarn graph-deploy-local
      ```

      Or to deploy all contracts and deploy subgraph shortcut will be:

      ```bash
      yarn deploy-and-graph
      ```

      Note: You may need confirm with ENTER in middle the process.

      Check the log to get the Link the subgraph deployed.


