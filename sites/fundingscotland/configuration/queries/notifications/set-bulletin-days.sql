{{#if @root.data.auth ~}}
CALL _setSubscriptionDays(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape (concat @root.context.metaData.bulletinCampaignName '-' @root.data.currentSite.name)}}},
  3
);
{{else}}
SET @query=false;
{{/if ~}}