import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PageComponent} from '../../../common/page.component';
import {Context} from '../../../service/context.service';
import {CropperSettings} from '../../../../lib/image-cropper/cropperSettings';
import {ImageCropperComponent} from '../../../../lib/image-cropper/imageCropperComponent';
import {PageTitleService} from '../../../service/page-title.service';

@Component({
    selector: 'user-face',
    templateUrl: './user.face.html',
    styleUrls: ['user.face.scss'],
})
export class UserFaceComponent extends PageComponent {
    @ViewChild('cropper', undefined)
    public cropper: ImageCropperComponent;
    public data1: any;
    public setting: CropperSettings;

    constructor(protected ctx: Context,
                protected route: ActivatedRoute,
                protected pageTitleService: PageTitleService,
                protected router: Router) {
        super(ctx, route, router);
        ctx.isShowAllSearchDiv = false;
    }

    protected onPageInit() {
        this.pageTitleService.setTitle("header.UserFace");
        this.setting = new CropperSettings();
        this.setting.width = 500;
        this.setting.height = 500;
        this.setting.cropperClass = 'custom-class';
        this.setting.croppingClass = 'cropping';
        this.setting.croppedWidth = 500;
        this.setting.croppedHeight = 500;

        this.setting.canvasWidth = 500;
        this.setting.canvasHeight = 500;
        this.setting.minWidth = 500;
        this.setting.minHeight = 500;
        this.setting.minWithRelativeToResolution = true;
        this.setting.rounded = false;

        this.setting.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.setting.cropperDrawSettings.strokeWidth = 2;

        this.setting.keepAspect = false;
        this.setting.preserveSize = false;
        this.setting.allowedFilesRegex=/\.(png)$/i;
        this.data1 = {};
    }

    protected onPageRender() {
    }
    public sendFace() {//上传图片操作
        let self = this;
        this.data1 = {imgUrl:this.cropper.cropper.getCroppedImage(true).src};
        if (!this.data1.imgUrl) {
            this.showError('请选择图片');
            return;
        }
        let req = {};
        req['image'] = this.data1.imgUrl;
        req['name'] = 'face';
        this.ctx.post('/Picture/upload', req).subscribe(result => {
            if (result.xeach == true) {
                self.showConfirm('提示', '修改头像成功', function (ans) {
                    if (ans.resolved) {
                        location.reload()
                    }
                });
            } else {
                self.showError(result.message);
            }
        });
    }


}
