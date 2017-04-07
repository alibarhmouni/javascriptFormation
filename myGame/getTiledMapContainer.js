/**
 * Transform a tiledmap JSON to a PIXI container with layer and tiles
 *
 * Author: Teddy Kishi
 *
 * [TODO] handle animations
 * [TODO] handle collisions
 */
let getTiledMapContainer = function(texturesArrNames, data){ 
let computeLayer = function(layer){
  // create tiles 2D array
  let map = [];
  for(let i = 0; i < layer.data.length; i+=layer.width){
    let newMap = [];
    for(let j = 0; j < layer.width; j++ ){
      newMap.push( layer.data[i+j] )
    }
    map.push(newMap);
  }
  return map;
}

let computeTileset = function(tilesets){
  // create tiles image 2D array
  let count = 0, coords = {};

  for(let i=0; i<tilesets.length; i++){
    let tileset = tilesets[i],
      columns = tileset.columns, // tileset.imagewidth / tileset.tilewidth;
      rows = tileset.imageheight / tileset.tileheight;
    // 
    for(let j=0; j<rows; j++){
      for(let k=0; k<columns; k++){
        coords[count] = { 
          x :  (k * tileset.tilewidth) - tileset.tilewidth,
          y :  j * tileset.tileheight,
          name : tileset.name
        };
        count++;
      }
    }
    
  }

  return coords;
}
//
let coords = computeTileset( data.tilesets );
// draw on pixi
let mapContainer = new PIXI.Container();

for(let o = 0; o < data.layers.length; o++){
  // set all the position fo each tiles
  let map = computeLayer( data.layers[o] );
  // create a main container  
  let layerContainer = new PIXI.Container();
  // set layer properties
  layerContainer.alpha = data.layers[o].opacity;
  layerContainer.visible = data.layers[o].visible;
  layerContainer.x = data.layers[o].x;
  layerContainer.y = data.layers[o].y;
  // so we can grab it by his name
  layerContainer.name = data.layers[o].name;
  // create tiles
  for(let rows=0; rows<map.length;rows++){
    for(let cols=0; cols<map[rows].length;cols++){

      let tile = coords[map[rows][cols]];
      let textureName = texturesArrNames[tile.name];
      
      let sprite = new PIXI.Sprite( 
        new PIXI.Texture(
          textureName, 
          new PIXI.Rectangle(tile.x, tile.y, data.tilesets[0].tilewidth, data.tilesets[0].tileheight))
      );
      // position the sprite
      sprite.x = cols * data.tilesets[0].tilewidth;
      sprite.y = rows * data.tilesets[0].tileheight;

      // add the sprite to the stage
      if(map[rows][cols] > 0){
        layerContainer.addChild(sprite);
      }
    }
  }
  // add the current layer to main container 
  mapContainer.addChild(layerContainer);
}

return mapContainer;

}
  
