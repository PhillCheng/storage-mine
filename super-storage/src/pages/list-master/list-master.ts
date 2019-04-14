import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  ModalController,
  NavController,
  PopoverController,
  ToastController
} from 'ionic-angular';

import { Item } from '../../models/item';
import {Items, Settings} from '../../providers';
import {MainPage} from "../index";

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];

  constructor(public navCtrl: NavController, public items: Items,
              public modalCtrl: ModalController, public popoverCtrl: PopoverController,
              public alertCtrl: AlertController, public toastCtrl: ToastController,
              public settings: Settings) {

    // 获取用户信息
    this.settings.getUser().then((user)=>{
      if(user && user.tokenId){
        this.queryItems(user.tokenId);
      }
    });
  }

  /**
   * The view loaded, let's query our items for the list
   */
  // ionViewDidLoad() {
  // }

  queryItems(id) {
    let params = {
      rows: 10,
      page: 1,
      userId: id
    };
    this.items.query(params).subscribe((res: any) => {
      if(res.code && res.code == "000000"){
        console.log(res.data);
        this.currentItems = res.data.rows;
      }else{
        let alert = this.alertCtrl.create({
          title: '错误',
          subTitle: res.msg,
          buttons: ['确认']
        });
        alert.present();
      }
    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: "网络异常",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });

  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    // this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

  // 打开新增工具栏
  presentPopover(myEvent) {
    // 通过组件别名创建
    let popover = this.popoverCtrl.create('PopoverPage');
    popover.present({
      ev: myEvent
    });
  }
}
