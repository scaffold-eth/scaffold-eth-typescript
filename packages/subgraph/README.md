
# Subgraph

1. Make sure your local chain is running first and you have ran `yarn deploy`.

2. Make sure you are running `graph-node` using docker, for instructions checkout `README.md` in `packages/services` directory.

3. create a `subgraph.yaml` file in `packages/subgraph` directory, refer to `packages/subgraph/src/subgraph.template.yaml` and change `{{localhost_YourContractAddress}}` to deployed `YourContract` address

4. Make sure you are at `packages/subgraph` in you terminal before running the below commands.

4. Create your <b>local subgraph</b> by running
      
      Note: `yarn remove-local` can be useful

      ```bash
      yarn create-local
      ```
      
5. Deploy your <b>local subgraph</b> by running

      ```bash 
      yarn ship-local
      ```

      Note: You may need confirm with ENTER in middle the process.

      Check the log to get the Link the subgraph deployed.

**Note : You need to add graphQL specific libraries in front-end to query the results. This will soon be updated.**
