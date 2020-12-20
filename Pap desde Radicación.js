_ext_.__onload__ = function(form) {
    var pk = _.path("_.shareppy.product_request.logic", true);
    /*	
        form.toggle(['-acoount_debit_pap', '-pagaduria_code','-calc_other_titular']);
        form.toggle(['-place_collection','-collection_day','-collect_day']);
    
        var now = new Date();
        _.f(form, 'fecha_apertura_plan').value = now.format('%d/%m/%Y');
        var tipo_recaudo = _.f(form, 'pap_tipo_recaudo').value;
       form.runAfterLoad(function(){
            var topic_id = form.get_data().topic_id;
            _.post(_app_root + '/clear_cache/shareppy/core_banking_saving.Saving/getContentSavingInfo', {'topic_id' : topic_id}, function(response){
                var json = JSON.parse(response);
                var tipo_recaudo = json.pap_tipo_recaudo;
                if(parseInt(tipo_recaudo) == 2){
                    form.toggle(['+place_collection','+collection_day','+collect_day']);
                }else{
                    form.toggle(['-place_collection','-collection_day','-collect_day']);
                }
            });
            //VALIDACION DE NUMERO 
            document.getElementById("pap_num_retiros").addEventListener("focusout",function(){
                let pap_num_retiros = _.f(form,"pap_num_retiros").value;
                let num_fee_pap = _.f(form,"num_fee_pap").value;
                if(parseInt(pap_num_retiros) < 2 || parseInt(pap_num_retiros) > parseInt(num_fee_pap)){
                    _.ui.alert("Numero de retiros no permitido, valor minimo: 2 , valor maximo: Numero de cuotas pap - (" + num_fee_pap + ")");
                }
            });
    
        });
    
        // Muestra link para mostrar las condiones de PAPs
        var link = _.f(form, 'link_conditions_pap');
        _.dom.ac(link,
            _.dom.e("a", "+", {
                'href': '#', html: 'Ver condiciones de PAP', id:"pap_condition_link", onclick: function (e) {
                    e.stop();
                    _.shareppy.saving.pap.show_conditions_pap(form);
                    _.f(form, 'boolean_validate_val_cuota').value = "true";
                    _.f(form, 'boolean_validate_num_cuota').value = "true";
                    _.f(form, 'boolean_validate_dia_fecha_pago').value = "true";
                }
            })
        );
        var dt = form.get_data();
        var isReadOnly = dt._form.readonly;
        if(isReadOnly){
            var link_pap_cond = document.querySelector(
                "a[id=pap_condition_link]"
            );
            if(link_pap_cond){
                link_pap_cond.style.pointerEvents = 'none';
            } 
        }
    
        pk.reloadDivSecondTitular = function(){
            var savingid = _.f(form,'saving_id').value;
            _.get(_app_root + '/clear_cache/shareppy/core_banking_saving.Saving/titular_info2/' + savingid + '/titular_pap', function(_txt) {
                _.load_content(_.f(form,'pap_titular_info_1'), _txt);
            });
        };
        
        _.shareppy.product_request.logic.reloadDivSecondTitular();
    
        pk.resetFieldsByPapProduct = function() {
            
            _.f(form, 'destiny_pap').value = "";
            _.f(form, 'destiny_pap_raw').value = "";
            _.f(form, 'campaign_pap').value = "";
            _.f(form, 'campaign_pap_raw').value = "";
            _.f(form, 'renovation_type').value = "";
            _.f(form, 'renovation_type_raw').value = "";
            _.f(form, 'retirement_type').value = "";
            _.f(form, 'retirement_type_raw').value = "";
            _.f(form, 'retirement_plan').value = "";
            _.f(form, 'retirement_plan_raw').value = "";
            _.f(form, 'pap_num_retiros').value = "";
            _.f(form, 'place_collection').value = "";
            _.f(form, 'place_collection_raw').value = "";
            _.f(form, 'collection_day').value = "";
            _.f(form, 'collection_day_raw').value = "";
            _.f(form, 'collect_day').value = "";
            _.f(form, 'collect_day_raw').value = "";  
            _.f(form, 'num_fee_pap').value = "";
            _.f(form, 'month_fee_value').value = "";    
            
            pk.fill_days();
            pk.resetFieldsByPapDestiny();
        };
    
        pk.resetFieldsByPapDestiny = function() {
            _.f(form, 'pap_tipo_recaudo').value = "";
            _.f(form, 'pap_tipo_recaudo_raw').value = "";
    
            _.f(form, 'num_fee_pap').value = "";
            _.f(form, 'month_fee_value').value = "";
            pk.resetFieldsByPapTipoRecaudo();
        };
    
        pk.resetFieldsByPapTipoRecaudo = function() {
            _.f(form, 'pap_frecuencia_pago').value = "";
            _.f(form, 'pap_frecuencia_pago_raw').value = "";
    
            _.f(form, 'num_fee_pap').value = "";
            _.f(form, 'month_fee_value').value = "";
            pk.resetFieldsByPapFrecuenciaPago();
        };
        */
    pk.resetFieldsByPapFrecuenciaPago = function() {
        _.f(form, 'boolean_validate_num_cuota').value = "false";
        _.f(form, 'boolean_validate_val_cuota').value = "false";

        _.f(form, 'num_fee_pap').value = "";
        _.f(form, 'month_fee_value').value = "";
        pk.get_pap_info_cuota();
    };

    pk.get_pap_info_cuota = function() {
        var cod_prod = _.f(form, 'product_pap').value;
        var cod_destiny = _.f(form, 'destiny_pap').value;
        var cod_tipo_recaudo = _.f(form, 'pap_tipo_recaudo').value;
        var cod_freq_pago = _.f(form, 'pap_frecuencia_pago').value;
        if (cod_destiny != "" && cod_tipo_recaudo != "" && cod_freq_pago != "") {
            var qs_atu = {
                'codpro': cod_prod
            };
            _.get(_app_root + '/clear_cache/shareppy/core_banking_saving_comultrasan.Atu/pap_conditions', qs_atu, function(atu_response) {
                if (atu_response && atu_response != null) {
                    var json_atu = JSON.decode(atu_response);
                    var atu_nrow = json_atu['__counter__'];
                    var num_cuota_desde_str = "";
                    var vcuota_str = "";
                    for (var i = 0; i < parseInt(atu_nrow); i++) {
                        var codigo_destino = parseInt(json_atu['codigo_destino' + i]);
                        var tipo_recaudo = parseInt(json_atu['tipo_recaudo' + i]);
                        var freq_pago = parseInt(json_atu['frecuencia_pago' + i]);
                        var ncuota_desde = parseInt(json_atu['cuota_desde' + i]);
                        var vcuota = parseInt(json_atu['valor_cuota' + i]);
                        if (parseInt(codigo_destino) == parseInt(cod_destiny) && parseInt(tipo_recaudo) == parseInt(cod_tipo_recaudo) && parseInt(freq_pago) == parseInt(cod_freq_pago)) {
                            num_cuota_desde_str += parseInt(ncuota_desde) + ",";
                            vcuota_str += vcuota + ",";
                        }
                    }
                    var num_cuota_desde_parts = num_cuota_desde_str.substring(0, num_cuota_desde_str.length - 1).split(",");
                    var vcuota_parts = vcuota_str.substring(0, vcuota_str.length - 1).split(",");
                    _.f(form, 'num_fee_pap').value = num_cuota_desde_parts[0] || "0";
                    _.f(form, 'month_fee_value').value = form.fx.format(vcuota_parts[0], 0) || "0";
                    console.log("Valor cuota =================== ", );
                    _.f(form, 'boolean_validate_num_cuota').value = "true";
                    _.f(form, 'boolean_validate_val_cuota').value = "true";
                }
            });
        }
    };
    /*
        pk.resetFieldsByPapTipoRetiro = function() {
            _.f(form, 'retirement_plan').value = "";
            _.f(form, 'retirement_plan_raw').value = "";
            _.f(form, 'pap_num_retiros').value = "";
        };
    
        pk.resetFieldsByPapProductoYTipoRecaudo = function() {
            console.log("Inicie el reset");
            var tipo_recaudo = _.f(form, 'pap_tipo_recaudo').value;
            if(parseInt(tipo_recaudo) == 2){
                form.toggle(['+place_collection','+collection_day','+collect_day']);
                    _.f(form, 'acoount_debit_pap_raw').value = "";
                    _.f(form, 'pagaduria_code_raw').value = "";
                    _.f(form, 'method_payment_pap_raw').value = "";
            }else{
                _.f(form, 'place_collection').value = "";
                _.f(form, 'place_collection_raw').value = "";
                _.f(form, 'collection_day').value = "";
                _.f(form, 'collection_day_raw').value = "";
                _.f(form, 'collect_day').value = "";
                _.f(form, 'collect_day_raw').value = "";
                form.toggle(['-place_collection','-collection_day','-collect_day']);
            }
        };
    
        pk.fill_days = function(){
            var codigo_producto = _.f(form, 'product_pap').value;
            var qs_aux = {};
            _.get(_app_root + '/clear_cache/shareppy/Offline/get_offline_query/get_parametros_producto_captacion', qs_aux, function(response){
                if(response != null && response != ""){
                    var json = JSON.decode(response);
                    for(var i = 0; i<json.length; i++){
                        var item_list = json[i];
                        var form_data_s = item_list["FORM_DATA"];
                        if(form_data_s != null && form_data_s != ""){
                            var form_data = JSON.decode(form_data_s);
                            var form_data_length = parseInt(form_data.seccion_productos_captacion_nrow);
                            for(var j = 0; j<form_data_length; j++){
                                var cod_sistema = form_data["cod_sistema_" + j];
                                if(parseInt(cod_sistema) == 14){
                                    var cod_prod = form_data["cod_producto_" + j];
                                    if(parseInt(cod_prod) == parseInt(codigo_producto)){
                                        _.f(form, 'dia1').value = form_data["dia1_" + j] || "";
                                        _.f(form, 'dia2').value = form_data["dia2_" + j] || "";
                                        var json_info = {"dia1" : _.f(form, 'dia1').value,
                                                         "dia2" : _.f(form, 'dia2').value};
                                        console.log("Este es el valor del json_info de los dias del parametro ::::::: " , json_info);
                                        form.mergeData(json_info,true);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            });
        };
    
     //   pk.validate_dia_fecha_pago = function(e,l){
            var dia1 = _.f(form, 'dia1').value;
            var dia2 = _.f(form, 'dia2').value;
            var fecha_pago = _.f(form, 'payment_date').value || "";
            var fecha_pago_aux = fecha_pago.split("/");
            var selected_payment_day = fecha_pago_aux[0] || 0;
            if(dia1 && dia2){
                if(fecha_pago != ""){
                    if(parseInt(dia1) != parseInt(selected_payment_day) && parseInt(dia2) != parseInt(selected_payment_day)){
                        //_.f(form, 'payment_date').value = "";
                        //_.f(form, 'payment_date_raw').value = "";
                        _.f(form, 'boolean_validate_dia_fecha_pago').value = "false";
                        //_.ui.alert("Fecha de recaudo inválida");
                        return false;
                    }
                }
            }
            _.f(form, 'boolean_validate_dia_fecha_pago').value = "true";
            _.f(form, 'selected_payment_day').value = parseInt(selected_payment_day);
            return true;
    //    };
    */
    pk.validate_val_cuota = function() {
        var cod_prod = _.f(form, 'product_pap').value;
        var cod_destiny = _.f(form, 'destiny_pap').value;
        var cod_tipo_recaudo = _.f(form, 'pap_tipo_recaudo').value;
        var cod_freq_pago = _.f(form, 'pap_frecuencia_pago').value;
        var numero_cuotas = _.f(form, 'num_fee_pap').value;
        var val_cuota = _.f(form, 'month_fee_value').value;
        console.log("val_cuota  ", val_cuota);
        if (cod_destiny != "" && cod_tipo_recaudo != "" && cod_freq_pago != "" && numero_cuotas != "") {
            var qs_atu = {
                'codpro': cod_prod
            };
            _.get(_app_root + '/clear_cache/shareppy/core_banking_saving_comultrasan.Atu/pap_conditions', qs_atu, function(atu_response) {
                if (atu_response && atu_response != null) {
                    var json_atu = JSON.decode(atu_response);
                    var atu_nrow = json_atu['__counter__'];
                    var val_cuota_str = "";
                    for (var i = 0; i < parseInt(atu_nrow); i++) {
                        var codigo_destino = parseInt(json_atu['codigo_destino' + i]);
                        var tipo_recaudo = parseInt(json_atu['tipo_recaudo' + i]);
                        var freq_pago = parseInt(json_atu['frecuencia_pago' + i]);
                        var vcuota_desde = parseInt(json_atu['valor_cuota' + i]);
                        if (parseInt(codigo_destino) == parseInt(cod_destiny) && parseInt(tipo_recaudo) == parseInt(cod_tipo_recaudo) && parseInt(freq_pago) == parseInt(cod_freq_pago)) {
                            val_cuota_str += vcuota_desde + ",";
                        }
                    }
                    var val_cuota_parts = val_cuota_str.substring(0, val_cuota_str.length - 1).split(",");
                    console.log("val_cuota_parts  ", validate_val_cuota)
                    for (var j = 0; j < val_cuota_parts.length; j++) {
                        var new_val_cuota = form.fx.vnum(val_cuota);
                        if (new_val_cuota < parseInt(val_cuota_parts[j])) {
                            if (j == val_cuota_parts.length - 1) {
                                _.f(form, 'pos_ok').value = "";
                                _.f(form, 'boolean_validate_val_cuota').value = "false";
                                break;
                            }
                        } else {
                            _.f(form, 'pos_ok').value = j;
                            _.f(form, 'boolean_validate_val_cuota').value = "true";
                            _.f(form, 'valor_cuota_desde').value = form.fx.vnum(val_cuota_parts[j]);
                            break;
                        }
                    }
                }
            });
        }
    };

    pk.validate_num_cuota = function() {
        var cod_prod = _.f(form, 'product_pap').value;
        var cod_destiny = _.f(form, 'destiny_pap').value;
        var cod_tipo_recaudo = _.f(form, 'pap_tipo_recaudo').value;
        var cod_freq_pago = _.f(form, 'pap_frecuencia_pago').value;
        var numero_cuotas = _.f(form, 'num_fee_pap').value;
        if (cod_destiny != "" && cod_tipo_recaudo != "" && cod_freq_pago != "") {
            var qs_atu = {
                'codpro': cod_prod
            };
            _.get(_app_root + '/clear_cache/shareppy/core_banking_saving_comultrasan.Atu/pap_conditions', qs_atu, function(atu_response) {
                if (atu_response && atu_response != null) {
                    var json_atu = JSON.decode(atu_response);
                    var atu_nrow = json_atu['__counter__'];
                    var num_cuota_desde_str = "";
                    var num_cuota_hasta_str = "";
                    for (var i = 0; i < parseInt(atu_nrow); i++) {
                        var codigo_destino = parseInt(json_atu['codigo_destino' + i]);
                        var tipo_recaudo = parseInt(json_atu['tipo_recaudo' + i]);
                        var freq_pago = parseInt(json_atu['frecuencia_pago' + i]);
                        var ncuota_desde = parseInt(json_atu['cuota_desde' + i]);
                        var ncuota_hasta = parseInt(json_atu['cuota_hasta' + i]);
                        if (parseInt(codigo_destino) == parseInt(cod_destiny) && parseInt(tipo_recaudo) == parseInt(cod_tipo_recaudo) && parseInt(freq_pago) == parseInt(cod_freq_pago)) {
                            num_cuota_desde_str += parseInt(ncuota_desde) + ",";
                            num_cuota_hasta_str += parseInt(ncuota_hasta) + ",";
                        }
                    }
                    var num_cuota_desde_parts = num_cuota_desde_str.substring(0, num_cuota_desde_str.length - 1).split(",");
                    var num_cuota_hasta_parts = num_cuota_hasta_str.substring(0, num_cuota_hasta_str.length - 1).split(",");
                    for (var j = 0; j < num_cuota_desde_parts.length; j++) {
                        if (!(parseInt(numero_cuotas) >= parseInt(num_cuota_desde_parts[j]) && parseInt(numero_cuotas) <= parseInt(num_cuota_hasta_parts[j]))) {
                            if (j == num_cuota_desde_parts.length - 1) {
                                _.f(form, 'pos_ok').value = "";
                                _.f(form, 'boolean_validate_num_cuota').value = "false";
                                break;
                            }
                        } else {
                            _.f(form, 'pos_ok').value = j;
                            _.f(form, 'boolean_validate_num_cuota').value = "true";
                            _.f(form, 'num_cuota_desde').value = parseInt(num_cuota_desde_parts[j]);
                            _.f(form, 'num_cuota_hasta').value = parseInt(num_cuota_hasta_parts[j]);
                            break;
                        }
                    }
                }
            });
        }
    };

};

_ext_.__onlists__ = function(lists) {
    /*
    lists.get_paymaster = function(combo){
        var form = this.form;
        var filtro = {};
        var qs_aux = {};
        _.get(_app_root + '/clear_cache/shareppy/Offline/get_offline_query/get_paymaster_offline', qs_aux, function(response){
            var json = JSON.decode(response);
            if(json){
                for (var i=0; i<json.length; i++) {
                    var item = json[i];
                    var name = item['NAME'];
                    var id = item['ID'];
                    filtro[id] =name;
                }
            }
            combo(filtro);
        });
    };
    */

    lists.get_pap_products = function(combo) {
        var form = this.form;
        var filtro = {};
        var qs_aux = {};
        _.get(_app_root + '/clear_cache/shareppy/Offline/get_offline_query/get_parametros_producto_captacion', qs_aux, function(response) {
            if (response != null && response != "") {
                var json = JSON.decode(response);
                _.get(_app_root + '/shareppy/core_banking_saving.Saving/get_person_info', { "document_number": _.f(form, "document_number").value }, function(customer_data) {
                    var json_customer_data = JSON.decode(customer_data);
                    var edad_titular = parseInt(json_customer_data['edad_titular']);
                    var tipo_titular = json_customer_data['person_classifier'] = "customer" ? 2 : json_customer_data['person_classifier'] = "enterprise" ? 1 : 2;
                    console.log("edad_titular  :" + edad_titular + "tipo_titular : " + tipo_titular);
                    for (var i = 0; i < json.length; i++) {
                        var item_list = json[i];
                        var form_data_s = item_list["FORM_DATA"];
                        if (form_data_s != null && form_data_s != "") {
                            var form_data = JSON.decode(form_data_s);
                            var form_data_length = parseInt(form_data.seccion_productos_captacion_nrow);
                            for (var j = 0; j < form_data_length; j++) {
                                var cod_sistema = form_data["cod_sistema_" + j];
                                var tip_cli = form_data["tip_cli_" + j];
                                var edad_min = form_data["edad_min_" + j] || 0;
                                var edad_max = form_data["edad_max_" + j] || 999;
                                if (parseInt(cod_sistema) == 14) {
                                    if (parseInt(tip_cli) == 0) {
                                        if (parseInt(edad_titular) >= parseInt(edad_min) && parseInt(edad_titular) <= parseInt(edad_max)) {
                                            var cod_prod = form_data["cod_producto_" + j];
                                            var nom_prod = form_data["producto_" + j];
                                            var nom_producto = cod_prod.trim() + " - " + nom_prod.trim();
                                        }
                                    } else if (parseInt(tipo_titular) == 1 && parseInt(tip_cli) == 1) {
                                        var cod_prod = form_data["cod_producto_" + j];
                                        var nom_prod = form_data["producto_" + j];
                                        var nom_producto = cod_prod.trim() + " - " + nom_prod.trim();
                                    } else if (parseInt(tipo_titular) == 2 && parseInt(tip_cli) == 2) {
                                        if (parseInt(edad_titular) >= parseInt(edad_min) && parseInt(edad_titular) <= parseInt(edad_max)) {
                                            var cod_prod = form_data["cod_producto_" + j];
                                            var nom_prod = form_data["producto_" + j];
                                            var nom_producto = cod_prod.trim() + " - " + nom_prod.trim();
                                        }
                                    }
                                    filtro[cod_prod] = nom_producto;
                                }
                            }
                        }
                    }
                    combo(filtro);
                });
            }
        });
    };


    lists.get_pap_destiny = function(combo) {
        var form = this.form;
        var cod_prod = _.f(form, 'product_pap').value;
        var qs_atu = {
            'codpro': cod_prod
        };
        if (cod_prod != "") {
            _.get(_app_root + '/clear_cache/shareppy/core_banking_saving_comultrasan.Atu/pap_conditions', qs_atu, function(atu_response) {
                console.log("atu_response   ", atu_response);
                if (atu_response && atu_response != null) {
                    var json_atu = JSON.decode(atu_response);
                    var atu_nrow = json_atu['__counter__'];
                    var pap_destiny_str = "";
                    for (var i = 0; i < parseInt(atu_nrow); i++) {
                        var codigo_destino = parseInt(json_atu['codigo_destino' + i]);
                        if (!pap_destiny_str.includes(codigo_destino)) {
                            pap_destiny_str += codigo_destino + ",";
                        }
                    }
                    var cod_destiny_list = pap_destiny_str.substring(0, pap_destiny_str.length - 1);
                    var qs = {
                        'cod_item_list': cod_destiny_list,
                        'classifier': 'pap_destiny'
                    };
                    _.get(_app_root + '/clear_cache/shareppy/core_banking_saving_comultrasan.SavingComultrasan/get_pap_items_helps', qs, function(response) {
                        var json = JSON.decode(response);
                        combo(json);
                    });
                } else {
                    combo({});
                }
            });
        } else {
            combo({});
        }
    };


    lists.get_pap_tipo_recaudo = function(combo) {
        var form = this.form;
        var cod_prod = _.f(form, 'product_pap').value;
        var cod_destiny = _.f(form, 'destiny_pap').value;
        var qs_atu = {
            'codpro': cod_prod
        };
        if (cod_destiny != "") {
            _.get(_app_root + '/clear_cache/shareppy/core_banking_saving_comultrasan.Atu/pap_conditions', qs_atu, function(atu_response) {
                if (atu_response && atu_response != null) {
                    var json_atu = JSON.decode(atu_response);
                    var atu_nrow = json_atu['__counter__'];
                    var pap_tipo_recaudo_str = "";
                    for (var i = 0; i < parseInt(atu_nrow); i++) {
                        var codigo_destino = json_atu['codigo_destino' + i];
                        var tipo_recaudo = parseInt(json_atu['tipo_recaudo' + i]);
                        if (parseInt(codigo_destino) == parseInt(cod_destiny)) {
                            if (!pap_tipo_recaudo_str.includes(tipo_recaudo)) {
                                pap_tipo_recaudo_str += tipo_recaudo + ",";
                            }
                        }
                    }
                    var cod_tipo_recaudo_list = pap_tipo_recaudo_str.substring(0, pap_tipo_recaudo_str.length - 1);
                    var qs = {
                        'cod_item_list': cod_tipo_recaudo_list,
                        'classifier': 'pap_tipo_recaudo'
                    };
                    _.get(_app_root + '/clear_cache/shareppy/core_banking_saving_comultrasan.SavingComultrasan/get_pap_items_helps', qs, function(response) {
                        var json = JSON.decode(response);
                        combo(json);
                    });
                } else {
                    combo({});
                }
            });
        } else {
            combo({});
        }
    };

    lists.get_pap_frecuencia_pago = function(combo) {
        var form = this.form;
        var cod_prod = _.f(form, 'product_pap').value;
        var cod_destiny = _.f(form, 'destiny_pap').value;
        var cod_tipo_recaudo = _.f(form, 'pap_tipo_recaudo').value;
        var qs_atu = {
            'codpro': cod_prod
        };
        if (cod_destiny != "" && cod_tipo_recaudo != "") {
            _.get(_app_root + '/clear_cache/shareppy/core_banking_saving_comultrasan.Atu/pap_conditions', qs_atu, function(atu_response) {
                if (atu_response && atu_response != null) {
                    var json_atu = JSON.decode(atu_response);
                    var atu_nrow = json_atu['__counter__'];
                    var pap_tipo_freq_str = "";
                    for (var i = 0; i < parseInt(atu_nrow); i++) {
                        var codigo_destino = json_atu['codigo_destino' + i];
                        var tipo_recaudo = json_atu['tipo_recaudo' + i];
                        var freq_pago = parseInt(json_atu['frecuencia_pago' + i]);
                        if (parseInt(codigo_destino) == parseInt(cod_destiny) && parseInt(tipo_recaudo) == parseInt(cod_tipo_recaudo)) {
                            if (!pap_tipo_freq_str.includes(freq_pago)) {
                                pap_tipo_freq_str += freq_pago + ",";
                            }
                        }
                    }
                    var cod_freq_pago_list = pap_tipo_freq_str.substring(0, pap_tipo_freq_str.length - 1);
                    var qs = {
                        'cod_item_list': cod_freq_pago_list,
                        'classifier': 'pap_frecuencia_pago'
                    };
                    _.get(_app_root + '/clear_cache/shareppy/core_banking_saving_comultrasan.SavingComultrasan/get_pap_items_helps', qs, function(response) {
                        var json = JSON.decode(response);
                        combo(json);
                    });
                } else {
                    combo({});
                }
            });
        }
    };

    lists.get_pap_tipo_retiro = function(combo) {
        var form = this.form;
        var filtro = {};
        var qs = {
            "CLASSIFIER": "pap_tipo_retiro"
        };
        _.get(_app_root + '/clear_cache/shareppy/Offline/get_offline_query/get_info_erp_base_type', qs, function(response) {
            var json = JSON.decode(response);
            if (json) {
                for (var i = 0; i < json.length; i++) {
                    var item = json[i];
                    var name = item['NAME'];
                    var id = item['SYMBOL'];
                    filtro[id] = name;
                }
            }
            combo(filtro);
        });
    };

    lists.get_pap_plan_retiro = function(combo) {
        var form = this.form;
        var filtro = {};
        var qs = {
            "CLASSIFIER": "pap_plan_retiro"
        };
        _.get(_app_root + '/clear_cache/shareppy/Offline/get_offline_query/get_info_erp_base_type', qs, function(response) {
            var json = JSON.decode(response);
            if (json) {
                for (var i = 0; i < json.length; i++) {
                    var item = json[i];
                    var name = item['NAME'];
                    var id = item['SYMBOL'];
                    filtro[id] = name;
                }
            }
            combo(filtro);
        });
    };

    lists.get_pap_campana = function(combo) {
        var form = this.form;
        var filtro = {};
        var qs = {
            "CLASSIFIER": "pap_campana"
        };
        _.get(_app_root + '/clear_cache/shareppy/Offline/get_offline_query/get_info_erp_base_type', qs, function(response) {
            var json = JSON.decode(response);
            if (json) {
                for (var i = 0; i < json.length; i++) {
                    var item = json[i];
                    var name = item['NAME'];
                    var id = item['SYMBOL'];
                    filtro[id] = name;
                }
            }
            combo(filtro);
        });
    };

    lists.get_pap_jornada_recaudo = function(combo) {
        var form = this.form;
        var filtro = {};
        var qs = {
            "CLASSIFIER": "pap_jornada_recaudo"
        };
        _.get(_app_root + '/clear_cache/shareppy/Offline/get_offline_query/get_info_erp_base_type', qs, function(response) {
            var json = JSON.decode(response);
            if (json) {
                for (var i = 0; i < json.length; i++) {
                    var item = json[i];
                    var name = item['NAME'];
                    var id = item['SYMBOL'];
                    filtro[id] = name;
                }
            }
            combo(filtro);
        });
    };

    lists.get_pap_lugar_recaudo = function(combo) {
        var form = this.form;
        var filtro = {};
        var qs = {
            "CLASSIFIER": "pap_lugar_recaudo"
        };
        _.get(_app_root + '/clear_cache/shareppy/Offline/get_offline_query/get_info_erp_base_type', qs, function(response) {
            var json = JSON.decode(response);
            if (json) {
                for (var i = 0; i < json.length; i++) {
                    var item = json[i];
                    var name = item['NAME'];
                    var id = item['SYMBOL'];
                    filtro[id] = name;
                }
            }
            combo(filtro);
        });
    };

    lists.get_pap_tipo_renovacion = function(combo) {
        var form = this.form;
        var filtro = {};
        var qs = {
            "CLASSIFIER": "pap_tipo_renovacion"
        };
        _.get(_app_root + '/clear_cache/shareppy/Offline/get_offline_query/get_info_erp_base_type', qs, function(response) {
            var json = JSON.decode(response);
            if (json) {
                for (var i = 0; i < json.length; i++) {
                    var item = json[i];
                    var name = item['NAME'];
                    var id = item['SYMBOL'];
                    filtro[id] = name;
                }
            }
            combo(filtro);
        });
    };

    lists.get_debit_counts = function(combo) {
        var form = this.form;
        var input_reference = this.getAttribute('classifier');
        if (_.f(form, input_reference).style.display != 'none') {

            var ced = _.f(form, 'cc_titular').value;
            var is_ahorro = _.f(form, 'ahorro').value;
            //_.post(_app_root + '/clear_cache/shareppy/core_banking_saving_comultrasan.Atu/debit_accounts_associate_product', {'ced' : ced, 'is_ahorro' : is_ahorro}, function(response){
            _.get(_app_root + '/clear_cache/shareppy/core_banking_saving_comultrasan.Atu/debit_account_saving', { 'cc_titular': ced, 'is_ahorro': is_ahorro }, function(response) {
                var dt = JSON.decode(response);
                if (Object.keys(dt).length > 0) {
                    combo(dt);
                } else {
                    var name = _.f(form, 'person_name').value;
                    var payment = _.f(form, 'method_payment_pap').value;
                    if (parseInt(payment) == 3) {
                        _.ui.alert('El cliente ' + name + ' no posee cuentas debito, por favor cambie la forma de pago.');
                    }
                    combo({});
                }
            }, function(msg, code) {
                _.ui.alert('Error ATU ' + msg + '. Por favor intente nuevamente');
                combo({});
            });
        } else {
            combo({});
        }

    };
};