import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PageComponent} from '../../../common/page.component';
import {Context} from '../../../service/context.service';
import {CropperSettings} from '../../../../lib/image-cropper/cropperSettings';
import {ImageCropperComponent} from '../../../../lib/image-cropper/imageCropperComponent';
import {PageTitleService} from '../../../service/page-title.service';
@Component({
    selector: 'user-sign',
    templateUrl: './user.sign.html',
    styleUrls: ['user.sign.scss'],
})
export class UserSignComponent extends PageComponent{
    @ViewChild('cropper', undefined)
    public cropper:ImageCropperComponent;
    public data1:any;
    public setting:CropperSettings;
    public readImage:any={};

    constructor(protected ctx: Context,
                protected route: ActivatedRoute,
                protected pageTitleService: PageTitleService,
                protected router: Router) {
        super(ctx, route, router);
        ctx.isShowAllSearchDiv=false;

    }

    protected onPageInit() {
        this.pageTitleService.setTitle("header.UserSign");
        this.setting = new CropperSettings();
        this.setting.allowedFilesRegex = /\.(png)$/i;
        this.setting.width = 100;
        this.setting.height = 100;
        this.setting.cropperClass = 'custom-class';
        this.setting.croppingClass = 'cropping';
        this.setting.croppedWidth = 100;
        this.setting.croppedHeight = 100;

        this.setting.canvasWidth = 500;
        this.setting.canvasHeight = 500;
        this.setting.minWidth = 100;
        this.setting.minHeight = 100;
        this.setting.minWithRelativeToResolution = true;
        this.setting.rounded = false;

        this.setting.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.setting.cropperDrawSettings.strokeWidth = 2;

        this.setting.keepAspect = false;
        this.setting.preserveSize = false;
        this.data1 = {};
    }

    protected onPageRender() {
    }


    public  sendImage(){//上传图片
        this.data1={imgUrl:this.cropper.cropper.getCroppedImage(true).src};
        if (!this.data1.imgUrl){
            this.showError("请选择图片");
            return;
        }
        let req={};
        req["image"]=this.data1.imgUrl;
        req["name"]="sign";
        this.ctx.post("/Picture/upload",req).subscribe(result=>{
            if(result.xeach===true){
                this.showOk("上传签名成功");
                this.readSign();
            }else{
                this.showError(result.message)
            }

        });
    }

    public readSign(){//读取当前标志
        this.ctx.post("/Picture/readSign").subscribe(result=>{
            this.readImage=result;
        });
    }

}
