$(document).ready(() => {
    console.log('ready')

    loadAislesAndGroups()


    function loadAislesAndGroups(){
        // Gets data on the items and aisles and store it in a json aislesAndGroups
        $.ajax({
            url: '/aisles_and_groups',
            type: 'Get',
            datatype: 'json',
            success: (data) =>{
                aislesAndGroups = data
                aisleDataRetrieved()
            }
        })
    }

    //called after data is retrieved
    function aisleDataRetrieved(){
        //loads the current aisles and groups as options inside arrays stored client side
        //aislesAndGroups = {"Bakery": ["Bread","Cake"], "Milk&Dairy":["Cheese", "Milk"]}

        //gets aisle select and aisleNames
        let itemAisleSelect = document.getElementById('itemAisle')
        let aisleNames = Object.keys(aislesAndGroups)

        //sets the selects for the itemAisle
        for(let i=0; i < aisleNames.length; i++){
            let tempOption = document.createElement('option')
            tempOption.text = aisleNames[i]
            itemAisleSelect.add(tempOption)
        }

        //gets the group select and group names
        let itemGroupSelect = document.getElementById('itemGroup')
        let firstGroupOptions = aislesAndGroups[aisleNames[0]]
        //inserts options into the group selection
        for(let i=0; i < firstGroupOptions.length; i++){
            let tempOption = document.createElement('option')
            tempOption.text = firstGroupOptions[i]
            itemGroupSelect.add(tempOption)
        }
    }

    $('#itemAisle').change((e)=>{
        console.log(aislesAndGroups)
        //need object stored somewhere with they keys equal to the aisle names arrays at element indexes
        //get arrays and put the strings inside them as the newOptions

        //gets current selection and the corresponding groups in newOptions
        let aisleSelection = document.getElementById('itemAisle').value
        let newOptions = aislesAndGroups[aisleSelection]

        //removes previous options from the group select
        let itemGroupSelect = document.getElementById('itemGroup')
        for(let i = itemGroupSelect.length-1; i >= 0 ; i--){ //clears all items in options
            itemGroupSelect.options.remove(i)
        }

        //inserts newOptions into the group select
        for(let i=0; i < newOptions.length; i++){
            let tempOption = document.createElement('option')
            tempOption.text = newOptions[i]
            itemGroupSelect.add(tempOption)
        }

    })


    //adds item in the selected fieds
    $('#addItemButton').click((e)=>{
        console.log('clicked')
        let itemData = {
            Price: document.getElementById("itemPrice").value,
            Weight: document.getElementById("itemWeight").value,
            ItemUID: document.getElementById("itemUID").value,
            Aisle: document.getElementById("itemAisle").value,
            Group: document.getElementById("itemGroup").value,
            Name: document.getElementById("itemName").value,
            Image: document.getElementById("itemImage").value,
            Quantity: document.getElementById("itemQuantity").value,
            Sale: document.getElementById("itemSale").checked,
            SalePercent: document.getElementById("itemSalePercent").value,
            Info: document.getElementById("itemInfo").value
        }

        console.log(itemData)
        addItem(itemData)
    })

    function addItem(itemData){
        $.ajax({
            url: '/add_item_2',
            type: 'Post',
            datatype: 'json',
            data: itemData,
            success: (data) =>{
                if(data){
                    console.log("Sucessfully added document with id: "+ data) // log data to console
                }
            }
        })
    }

    function toggleAlert(){
        $(".alert").toggleClass('show out');
        return false; // Keep close.bs.alert event from removing from DOM
    }

    $("#btn").on("click", toggleAlert);
    $('#badItemAlert').on('close.bs.alert', toggleAlert)

})
