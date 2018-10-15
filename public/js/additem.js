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
            console.log('something')
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
        let itemData = {Aisle:null, Group:null, Name:null, Image:null, Quantity:null, Sale:null, SalePercent:null, Info:null}

        itemData.Aisle = document.getElementById("itemAisle").value
        itemData.Group = document.getElementById("itemGroup").value
        itemData.Name = document.getElementById("itemName").value
        itemData.Image = document.getElementById("itemImage").value
        itemData.Quantity = document.getElementById("itemQuantity").value
        itemData.Sale = document.getElementById("itemSale").checked
        itemData.SalePercent = document.getElementById("itemSalePercent").value
        itemData.Info = document.getElementById("itemInfo").value
        console.log(itemData)
        addItem(itemData)
    })

    function addItem(itemData){
        $.ajax({
            url: '/add_item',
            type: 'Post',
            datatype: 'json',
            data: itemData,
            success: (data) =>{
                console.log("sucess") // log data to console
                console.log(data)
            }
        })
    }
})