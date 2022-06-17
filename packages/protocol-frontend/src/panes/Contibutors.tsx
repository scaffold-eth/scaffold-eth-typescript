import { useCOBApi } from "../components/COBProvider";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

interface IContributor {
  registrar: string,
  address: string,
  hash: string,
}

export default function Contributors(){
  const cobapi = useCOBApi();
  const contributorsContract = cobapi.contributors();
  const [contributors, setContributors] = useState<IContributor[]>([])

  useEffect(() => {
    const filter = contributorsContract.filters['Registered']();
    contributorsContract.queryFilter(filter).then(registeredEvents => {
      const unconfirmedContributors = registeredEvents.map((event) => ({
        registrar: event.args.registrar,
        address: event.args.contributor,
        hash: event.args.contributorHash
      }))
      setContributors(unconfirmedContributors);
    });
  })
  return (
    <>
      <Typography variant={"h3"} sx={{textAlign:"center"}} gutterBottom>Contributors</Typography>
      {contributors.length === 0 && (
        <Box><Typography>No contributors found</Typography></Box>
      )}
      {contributors.map((contributor) => (
        <Box><Typography>{contributor.address} registered by {contributor.registrar}</Typography></Box>
      ))}
    </>

  )
}
