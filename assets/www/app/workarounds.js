Ext.override(Ext.data.Connection, {
	abort : function(r) {
        if (r && this.isLoading(r)) {
            r.xhr.abort();
            clearTimeout(r.timeout);
            delete(r.timeout);
            r.aborted = true;
            this.onComplete(r);
        }
        else if (!r) {
            var id;
            for(id in this.requests) {
                if (!this.requests.hasOwnProperty(id)) {
                    continue;
                }
                this.abort(this.requests[id]);
            }
        }
    },

	onComplete : function(r) {
        var options = r.options,
            success = true,
            response;
        console.log('onComplete'+r.options.url+'***'+var_dump(r, 3)+'***');
        console.log(' ');
        console.log(' ');
        console.log(' ');
        
        //this is some kind of workaround
        //if xhr is not defined we set the status to 0
        //and raise an exception below 
        if (r.xhr) {
        	var status = r.xhr.status;
        } else  {
        	var status = 0;
        }

        if ((status >= 200 && status < 300) || status == 304) {
        	console.log('onComplete OK '+status);
            response = this.createResponse(r);
            this.fireEvent('requestcomplete', this, response, options);
            if (options.success) {
                if (!options.scope) {
                    options.success(response, options);
                }
                else {
                    options.success.call(options.scope, response, options);
                }
            }
        }
        else {
        	console.log('onComplete NOK '+status);
            success = false;
            switch (status) {
            	case 0:  //workaround
            		//return;
                case 12002:
                case 12029:
                case 12030:
                case 12031:
                case 12152:
                case 13030:
                	console.log('EXCEPTION');
                    response = this.createException(r);
                    break;
                default:
                	console.log('RESPONSE');
                    response = this.createResponse(r);
            }
            this.fireEvent('requestexception', this, response, options);
            if (options.failure) {
                if (!options.scope) {
                    options.failure(response, options);
                }
                else {
                    options.failure.call(options.scope, response, options);
                }
            }
        }

        if (options.callback) {
            if (!options.scope) {
                options.callback(options, success, response);
            }
            else {
                options.callback.call(options.scope, options, success, response);
            }
        }
        
        delete this.requests[r.id];
    }
});