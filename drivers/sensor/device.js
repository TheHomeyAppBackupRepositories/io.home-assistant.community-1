'use strict';

const BaseDevice = require('../basedevice');

class SensorDevice extends BaseDevice {

    async onInit() {
        await super.onInit();

        // Read main capability as devcice capability
        this.capability = this.getCapabilities().filter((entry) => {
            if (entry.indexOf('.') == -1) return true;
        })[0];

        // maintenance actions
        this.registerCapabilityListener('button.reconnect', async () => {
            await this.clientReconnect()
        });
    }

    async updateCapabilities(){
        // Add new capabilities (if not already added)
        try{
            if (!this.hasCapability('button.reconnect'))
            {
            await this.addCapability('button.reconnect');
            }
        }
        catch(error){
            this.error("Error adding capability: "+error.message);
        }
    }

    // Entity update ============================================================================================
    async onEntityUpdate(data) {
        await super.onEntityUpdate(data);
        try {
            // let value = this.getCapabilityValue(this.capability);
            // switch (typeof(value)){
            //     case "number":
            //         await this.setCapabilityValue(this.capability, parseFloat(data.state));
            //         break;
            //     case "boolean":
            //         await this.setCapabilityValue(this.capability, data.state == "on")
            //         break;
            //     case "string":
            //         await this.setCapabilityValue(this.capability, data.state);
            //         break;
            // }
            if (data && data.entity_id && this.entityId == data.entity_id){
                if (this.capability == "measure_generic"){
                    // String capabilities
                    await this.setCapabilityValue(this.capability, data.state);
                }
                else if (this.capability.startsWith("alarm")){
                    // boolean capability
                    if (data.state == "on"){
                        await this.setCapabilityValue(this.capability, true);
                    }
                    if (data.state == "off"){
                        await this.setCapabilityValue(this.capability, false);
                    }
                }
                else{
                    // numeric capability
                    await this.setCapabilityValue(this.capability, parseFloat(data.state));
                }
            }
        }
        catch(error) {
            this.error("CapabilitiesUpdate error: "+ error.message);
        }
    }


}

module.exports = SensorDevice;