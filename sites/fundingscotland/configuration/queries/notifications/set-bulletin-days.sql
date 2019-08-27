{{#if @root.data.auth ~}}
CALL _setSubscriptionDays(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape @root.data.bulletinName}}},
  3
);
{{else}}
SET @query=false;
{{/if ~}}