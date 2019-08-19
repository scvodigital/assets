{{#if @root.data.auth ~}}
CALL _removeSubscriptionPartition(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape @root.data.bulletinName}}},
  NULL
);
{{else}}
SET @query=false;
{{/if ~}}