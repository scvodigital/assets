{{#if @root.data.auth ~}}
CALL _removeSubscriptionPartition(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape (concat @root.context.metaData.shortlistCampaignName '-' @root.data.currentSite.name)}}},
  NULL
);
{{else}}
SET @query=false;
{{/if ~}}