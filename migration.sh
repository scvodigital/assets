#!/usr/bin/env bash

# rsync -av --progress ../frontend/sites/configurations/digitalparticipation/* ./sites/digitalparticipation/configuration
# rsync -av --progress ../frontend/sites/configurations/emailer/* ./sites/emailer/configuration
# rsync -av --progress ../frontend/sites/configurations/fundingscotland/* ./sites/fundingscotland/configuration
# rsync -av --progress ../frontend/sites/configurations/getinvolved-legacy/* ./sites/getinvolved-legacy/configuration
# rsync -av --progress ../frontend/sites/configurations/getinvolved/* ./sites/getinvolved/configuration
# rsync -av --progress ../frontend/sites/configurations/goodmoves/* ./sites/goodmoves/configuration
# rsync -av --progress ../frontend/sites/configurations/humanrightsdeclaration/* ./sites/humanrightsdeclaration/configuration
# rsync -av --progress ../frontend/sites/configurations/scotlandforeurope/* ./sites/scotlandforeurope/configuration
# rsync -av --progress ../frontend/sites/configurations/scvo/* ./sites/scvo/configuration
# rsync -av --progress ../frontend/sites/configurations/volunteerscotland-search/* ./sites/volunteerscotland-search/configuration

rm ./sites/digitalparticipation/configuration/partials/components
rm ./sites/fundingscotland/configuration/partials/components
rm ./sites/getinvolved/configuration/partials/components
rm ./sites/getinvolved-legacy/configuration/partials/components
rm ./sites/goodmoves/configuration/partials/components
rm ./sites/humanrightsdeclaration/configuration/partials/components
rm ./sites/scotlandforeurope/configuration/partials/components
rm ./sites/scvo/configuration/partials/components
rm ./sites/volunteerscotland-search/configuration/partials/components

ln -s ../../../global/components ./sites/digitalparticipation/configuration/partials/components
ln -s ../../../global/components ./sites/fundingscotland/configuration/partials/components
ln -s ../../../global/components ./sites/getinvolved/configuration/partials/components
ln -s ../../../global/components ./sites/getinvolved-legacy/configuration/partials/components
ln -s ../../../global/components ./sites/goodmoves/configuration/partials/components
ln -s ../../../global/components ./sites/humanrightsdeclaration/configuration/partials/components
ln -s ../../../global/components ./sites/scotlandforeurope/configuration/partials/components
ln -s ../../../global/components ./sites/scvo/configuration/partials/components
ln -s ../../../global/components ./sites/volunteerscotland-search/configuration/partials/components