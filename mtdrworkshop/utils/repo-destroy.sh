#!/bin/bash
# Copyright (c) 2021 Oracle and/or its affiliates.
# Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

# Fail on error
set -e


# Delete Images
<<<<<<< HEAD:MtdrSpring/utils/repo-destroy.sh
#echo "Deleting Images"
#IIDS=`oci artifacts container image list --compartment-id "$(state_get COMPARTMENT_OCID)" --query "join(' ',data.items[*].id)" --raw-output`
#for i in $IIDS; do
#  oci artifacts container image delete --image-id "$i" --force
#done
#
## Delete Repos
#echo "Deleting Repositories"
#REPO_IDS=`oci artifacts container repository list --compartment-id "$(state_get COMPARTMENT_OCID)" --query "join(' ', data.items[*].id)" --raw-output`
#for r in $REPO_IDS; do
#  oci artifacts container repository delete --repository-id "$r" --force
#done
=======
echo "Deleting Images"
IIDS=`oci artifacts container image list --compartment-id "$(state_get COMPARTMENT_OCID)" --query "join(' ',data.items[*].id)" --raw-output`
for i in $IIDS; do
  oci artifacts container image delete --image-id "$i" --force
done

# Delete Repos
echo "Deleting Repositories"
REPO_IDS=`oci artifacts container repository list --compartment-id "$(state_get COMPARTMENT_OCID)" --query "join(' ', data.items[*].id)" --raw-output`
for r in $REPO_IDS; do 
  oci artifacts container repository delete --repository-id "$r" --force
done
>>>>>>> b3f7bcae1e130a73ee5b10319c543469b6910a13:mtdrworkshop/utils/repo-destroy.sh

