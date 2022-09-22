# Graph-Node

1.  Make sure you are in `packages/services` directory in your terminal before running the following commands and **`docker`** is also running.

      ```bash
      cd graph-node && docker-compose up
      ```

      Note: Sometimes you need remove the old containers before run it.

      `Windows users` using WSL may need run `sudo` before `rm -rf graph-node/data/`.

      ```bash
      rm -rf graph-node/data/
      cd graph-node && docker-compose up
      ```
