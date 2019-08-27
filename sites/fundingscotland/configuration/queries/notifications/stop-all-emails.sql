{{#if @root.data.auth ~}}
UPDATE subscriptionPartitions
SET active = 0
WHERE
  campaign IN (
    {{{mysqlEscape (concat @root.context.metaData.emailCampaignName '-' @root.data.currentSite.name)}}},
    {{{mysqlEscape (concat @root.context.metaData.shortlistCampaignName '-' @root.data.currentSite.name)}}},
    {{{mysqlEscape @root.data.bulletinName}}}
  ) AND
  email = {{{mysqlEscape @root.data.auth.email}}};
{{else}}
SET @query=false;
{{/if ~}}