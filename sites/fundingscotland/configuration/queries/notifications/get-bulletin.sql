{{#if @root.data.auth ~}}
CALL _getSubscriptionParameters(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape (concat @root.context.metaData.bulletinCampaignName '-' @root.data.currentSite.name)}}},
  NULL
);
{{else}}
SET @query=false;
{{/if ~}}