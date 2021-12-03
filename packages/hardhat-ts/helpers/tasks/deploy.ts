import { TASK_DEPLOY_RUN_DEPLOY } from 'hardhat-deploy'
import { subtask } from 'hardhat/config'

/**
 * Override `hardhat-deploy` deploy subtask to do some magic after it runs.
 */
subtask(TASK_DEPLOY_RUN_DEPLOY, async (args, hre, runSuper) => {
  if (!runSuper.isDefined) return

  await runSuper(args)

  // Only continue on a live network
  if (!hre.network.live) return

  // Export contract data
  await hre.run('export:deployments')

  // Verify contracts
  await hre.run('verify')
})
