const fs = require('fs');
const path = require('path');
const util = require('util');
const p = require('request-promise-native');
const s = require('string');
const dot = require('dot-object');

const cachePath = path.join(__dirname, '/menus-cache.json');
let allItems = [];
let rootMenu; 

async function main() {
  console.log('Running');
  rootMenu = new MenuItem(0, 'Home', '/', 0, 'home', '^/?$', 'home');
  await getMenus();
  populateRoot();
  console.log('Loaded a total', allItems.length, 'menu items into memory'); 
}

function populateRoot() {
  while (allItems.length > 0) {
    for (const [index, menuItem] of Object.entries(allItems)) {
      // Search for parent
      const parent = findParent(rootMenu, menuItem.parentId);
      if (parent && parent.item) {
        parent.item.children.push(menuItem);
        for (const id of parent.intersection) {
          const parentIdIndex = menuItem.parentId.findIndex(i => i === id);
          menuItem.parentId.splice(parentIdIndex, 1);
        }
        if (menuItem.parentId.length === 0) {
          allItems[index] = null;
        }
      }
    }
    allItems = allItems.filter(i => !!i);
  }

  console.log(util.inspect(rootMenu, false, null, true));
  console.log(allItems);
}

async function getMenus() {
  if (fs.existsSync(cachePath)) {
    allItems = JSON.parse(fs.readFileSync(cachePath).toString());
    return;
  }

  const baseUrl = 'https://cms.scvo.org/wp-json/wp-api-menus/v2/menus/';

  console.log('Fetching menus');
  const menus = await p.get({ url: baseUrl, json: true });
  console.log('Fetched', menus.length, 'menus');

  for (const item of menus) {
    const menuUrl = baseUrl + item.ID;
    console.log('Fetching menu:', menuUrl);
    const menu = await p.get({ url: menuUrl, json: true });
    console.log('Fetched menu:', item.ID);

    for (const menuItem of menu.items) {
      addMenuItem(menuItem);
    }
  }

  fs.writeFileSync(cachePath, JSON.stringify(allItems, null, 4));
}

function addMenuItem(newItem) {
  const url = '/' + (newItem.url.split('scvo.org/')[1] || '');
  const pattern = newItem.meta_data['menu-item-route-pattern'] && newItem.meta_data['menu-item-route-pattern'][0] || '';
  const slug = newItem.object_slug || s(newItem.title).slugify().s;
  const existingItem = allItems.find(item => item.url === url || item.objectId === newItem.object_id);
  
  if (existingItem) {
    existingItem.id.push(newItem.id);
    if (typeof existingItem.label.find(i => i === newItem.title) === 'undefined') {
      existingItem.label.push(newItem.title);
    }
    if (typeof existingItem.parentId.find(i => i === newItem.parent) === 'undefined') {
      existingItem.parentId.push(newItem.parent);
    }
    if (typeof existingItem.pattern.find(i => i === pattern) === 'undefined') {
      existingItem.pattern.push(pattern);
    }
  } else {
    allItems.push(new MenuItem(
        newItem.id, newItem.title, url, newItem.object_id, 
        slug, newItem.parent, pattern, ''));
  }

  if (Array.isArray(newItem.children) && newItem.children.length > 0) {
    for (const child of newItem.children) {
      addMenuItem(child);
    }
  }
}

function findParent(menuItem, parentId) {
  const intersection = parentId.filter(i => {
    return menuItem.id.indexOf(i) > -1;
  });
  if (intersection.length > 0) {
    return { item: menuItem, intersection };
  } else if (Array.isArray(menuItem.children)) {
    for (const child of menuItem.children) {
      const found = findParent(child, parentId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function traverseMenu(path, callback) {
  const current = dot.pick(path, rootMenu);
  const exit = callback(path, current);
  if (exit) return;
  if (Array.isArray(current.children)) {
    for (const [index, child] of Object.entries(current.children)) {
      const newPath = path + '.children.' + index; 
      traverseMenu(path, callback);
    }
  }
}

class MenuItem {
  constructor(id, label, url, objectId, objectSlug, parentId, pattern, icon) {
    this.id = [id];
    this.label = [label];
    this.url = url;
    this.objectId = objectId;
    this.objectSlug = objectSlug;
    this.parentId = [parentId];
    this.pattern = [pattern];
    this.icon = icon;
    this.children = [];
  }
}

(async () => { await main(); })();