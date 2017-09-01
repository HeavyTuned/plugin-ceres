import ApiService from "services/ApiService";

const state =
    {
        billingAddressId: null,
        billingAddressList: [],
        deliveryAddressId: null,
        deliveryAddressList: []
    };

const mutations =
    {
        setBillingAddressList(state, billingAddressList)
        {
            if (Array.isArray(billingAddressList))
            {
                state.billingAddressList = billingAddressList;
            }
        },

        setBillingAddressId(state, billingAddressId)
        {
            if (billingAddressId)
            {
                state.billingAddressId = billingAddressId;
            }
        },

        setDeliveryAddressList(state, deliveryAddressList)
        {
            if (Array.isArray(deliveryAddressList))
            {
                state.deliveryAddressList = deliveryAddressList;
            }
        },

        setDeliveryAddressId(state, deliveryAddressId)
        {
            if (deliveryAddressId)
            {
                state.deliveryAddressId = deliveryAddressId;
            }
        },

        removeBillingAddress(state, billingAddress)
        {
            const index = state.billingAddressList.indexOf(billingAddress);

            if (index !== -1)
            {
                state.billingAddressList.splice(index, 1);
            }
        },

        removeDeliveryAddress(state, deliveryAddress)
        {
            const index = state.deliveryAddressList.indexOf(deliveryAddress);

            if (index !== -1)
            {
                state.deliveryAddressList.splice(index, 1);
            }
        },

        addBillingAddress(state, billingAddress, index)
        {
            if (billingAddress)
            {
                if (index)
                {
                    state.billingAddressList.splice(index, 0, billingAddress);
                }
                else
                {
                    state.billingAddressList.push(billingAddress);
                }
            }
        },

        addDeliveryAddress(state, deliveryAddress, index)
        {
            if (deliveryAddress)
            {
                if (index)
                {
                    state.deliveryAddressList.splice(index, 0, deliveryAddress);
                }
                else
                {
                    state.deliveryAddressList.push(deliveryAddress);
                }
            }
        },

        updateBillingAddress(state, billingAddress)
        {
            if (billingAddress)
            {
                addressToUpdate = state.billingAddressList.find(entry => entry.id === billingAddress.id);
                addressToUpdate = billingAddress;
            }
        },

        updateDeliveryAddress(state, deliveryAddress)
        {
            if (deliveryAddress)
            {
                addressToUpdate = state.deliveryAddressList.find(entry => entry.id === deliveryAddress.id);
                addressToUpdate = deliveryAddress;
            }
        }
    };

const actions =
    {
        setBillingAddress({commit}, {id, addressList})
        {
            commit("setBillingAddressList", addressList);
            commit("setBillingAddressId", id);
        },

        setDeliveryAddress({commit}, {id, addressList})
        {
            commit("setDeliveryAddressList", addressList);
            commit("setDeliveryAddressId", id);
        },

        selectAddress({dispatch}, {selectedAddressId, addressType})
        {
            if (addressType === "1")
            {
                return dispatch("selectBillingAddress", selectedAddressId);
            }
            else if (addressType === "2")
            {
                return dispatch("selectDeliveryAddress", selectedAddressId);
            }

            return new Promise();
        },

        selectBillingAddress({commit}, selectedAddressId)
        {
            return new Promise((resolve, reject) =>
            {
                // TODO add call to set address
                commit("setBillingAddressId", selectedAddressId);
            });
        },

        selectDeliveryAddress({commit}, selectedAddressId)
        {
            return new Promise((resolve, reject) =>
            {
                // TODO add call to set address
                commit("setDeliveryAddressId", selectedAddressId);
            });
        },

        deleteAddress({dispatch, state, commit}, {address, addressType})
        {
            return new Promise((resolve, reject) =>
            {
                let addressIndex = -1;

                if (addressType === "1")
                {
                    addressIndex = state.billingAddressList.indexOf(address);
                    commit("removeBillingAddress", address);
                }
                else if (addressType === "2")
                {
                    addressIndex = state.deliveryAddressList.indexOf(address);
                    commit("removeDeliveryAddress", address);
                }

                ApiService.delete("/rest/io/customer/address/" + address.id + "?typeId=" + addressType)
                    .done(response =>
                    {
                        resolve();
                    })
                    .fail(error =>
                    {
                        if (addressType === "1")
                        {
                            commit("addBillingAddress", address, addressIndex);
                        }
                        else if (addressType === "2")
                        {
                            commit("addDeliveryAddress", address, addressIndex);
                        }
                        reject();
                    });
            });
        },

        ceateAddress({commit}, {address, addressType})
        {
            return new Promise((resolve, reject) =>
            {
                ApiService.post("/rest/io/customer/address?typeId=" + addressType, address, {supressNotifications: true})
                    .done(response =>
                    {
                        if (addressType === "1")
                        {
                            commit("addBillingAddress", address);
                        }
                        else if (addressType === "2")
                        {
                            commit("addDeliveryAddress", address);
                        }

                        resolve();
                    })
                    .fail(error =>
                    {
                        reject();
                    });
            });
        },

        updateAddress({commit}, {address, addressType})
        {
            return new Promise((resolve, reject) =>
            {
                ApiService.put("/rest/io/customer/address/" + newData.id + "?typeId=" + addressType, newData, {supressNotifications: true})
                    .done(response =>
                    {
                        if (addressType === "1")
                        {
                            commit("updateBillingAddress", address);
                        }
                        else if (addressType === "2")
                        {
                            commit("updateDeliveryAddress", address);
                        }

                        resolve();
                    })
                    .fail(error =>
                    {
                        reject();
                    });
            });
        }
    };

const getters =
    {
    };

export default
{
    state,
    mutations,
    actions,
    getters
};