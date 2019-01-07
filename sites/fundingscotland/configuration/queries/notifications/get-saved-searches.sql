{{#if @root.data.auth ~}}
CALL _getSubscriptions(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape (concat @root.context.metaData.emailCampaignName '-' @root.data.currentSite.name)}}},
  NULL
);
{{else}}
SET @query=false;
{{/if ~}}