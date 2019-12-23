$( function() {
  if (document.location.href.match(/\/goods\/\d+\/edit/)){
    var dropzone = $(".item__img__dropzone__input");
    var dropzone2 = $(".item__img__dropzone2__input2");
    var appendzone = $(".item__img__dropzone2")
    var input_area = $(".input_area");
    var preview = $("#preview-edit");
    var preview2 = $("#preview2-edit");
  
    // 登録済画像と新規追加画像を全て格納する配列（ビュー用）
    var images = [];
    // 登録済画像データだけの配列（DB用）
    var registered_images_ids =[]
    // 新規追加画像データだけの配列（DB用）
    var new_image_files = [];
    // 消すデータ
    destroy_images_ids = [];
  
  
    // 登録済画像のプレビュー表示
    gon.good_images.forEach(function(image, index){
      var img = $(`<div class= "img_view  "><div class="img_area "><img src=${image.image.url} class="image" width ="70" height="114" ></div></div>`);
  
      // カスタムデータ属性を付与
      img.data("image", index);
      img.val( image.id )
      var btn_wrapper = $('<div class="btn_wrapper"><a class="btn_edit">編集</a><a class="btn_delete">削除</a></div>');
  
      // 画像に編集・削除ボタンをつける
      img.append(btn_wrapper);

  
      // 登録済画像のビューをimagesに格納
      images.push(img)
      registered_images_ids.push(image.id)
    })
  
    // 画像が４枚以下のとき
    if (images.length <= 4) {
      preview.empty();
      $.each(images, function(index, image) {
        image.data('image', index);
        preview.append(image);
      })
      dropzone.css({
        'width': `calc(100% - (20% * ${images.length}))`
      })
  
      // 画像が５枚のとき１段目の枠を消し、２段目の枠を出す
    } else if (images.length == 5) {
      preview.empty();
      $.each(images, function(index, image) {
        image.data("image", index);
        preview.append(image);
      });
      appendzone.css({
        display: "block"
      });
      dropzone.css({
        display: "none"
      });
      preview2.empty();
  
      // 画像が６枚以上のとき
    } else if (images.length >= 6) {
      // １〜５枚目の画像を抽出
      var pickup_images1 = images.slice(0, 5);
  
      // １〜５枚目を１段目に表示
      preview.empty();
      $.each(pickup_images1, function(index, image) {
        image.data('image', index);
        preview.append(image);
      })
  
      // ６枚目以降の画像を抽出
      var pickup_images2 = images.slice(5);
  
      // ６枚目以降を２段目に表示
      $.each(pickup_images2, function(index, image) {
        image.data('image', index + 5);
        preview2.append(image);
      })
  
      dropzone.css({
        'display': 'none'
      })
      appendzone.css({
        'display': 'block'
      })
      dropzone2.css({
        'display': 'block',
        'width': `calc(100% - (20% * ${images.length - 5}))`
      })
  
      // 画像が１０枚になったら枠を消す
      if (images.length == 10) {
        dropzone2.css({
          display: "none"
        });
      }
    }
  
    var new_image = $(
      `<input multiple= "multiple" name="images[image][]" class="upload-image" data-image= ${images.length} type="file" id="upload-image">`
    );
    input_area.append(new_image);
  
  
    // 画像を新しく追加する場合
    $(document).on("change", 'input[type= "file"].upload-image', function() {
      var file = $(this).prop("files")[0];
      new_image_files.push(file)
      var reader = new FileReader();
      var img = $(`<div class= "img_view "><div class="img_area"><img class="image" width ="70" height="114" ></div></div>`);
  
      reader.onload = function(e) {
        var btn_wrapper = $('<div class="btn_wrapper"><a class="btn_edit">編集</a><a class="btn_delete">削除</a></div>');
  
        // 画像に編集・削除ボタンをつける
        img.append(btn_wrapper);
        img.find("img").attr({
          src: e.target.result
        });
      };
  
      reader.readAsDataURL(file);
      images.push(img);
  
      // 画像が４枚以下のとき
      if (images.length <= 4) {
        preview.empty();
        $.each(images, function(index, image) {
          image.data('image', index);
          preview.append(image);
        })
        dropzone.css({
          'width': `calc(100% - (20% * ${images.length}))`
        })
  
        // 画像が５枚のとき１段目の枠を消し、２段目の枠を出す
      } else if (images.length == 5) {
        preview.empty();
        $.each(images, function(index, image) {
          image.data("image", index);
          preview.append(image);
        });
        appendzone.css({
          display: "block"
        });
        dropzone.css({
          display: "none"
        });
        preview2.empty();
  
        // 画像が６枚以上のとき
      } else if (images.length >= 6) {
  
        // 配列から６枚目以降の画像を抽出
        var pickup_images = images.slice(5);
  
        $.each(pickup_images, function(index, image) {
          image.data("image", index + 5);
          preview2.append(image);
          dropzone2.css({
            width: `calc(100% - (20% * ${images.length - 5}))`
          });
        });
  
        // 画像が１０枚になったら枠を消す
        if (images.length == 10) {
          dropzone2.css({
            display: "none"
          });
        }
      }
  
      var new_image = $(
        `<input multiple= "multiple" name="images[image][]" class="upload-image" data-image= ${images.length} type="file" id="upload-image">`
      );
      
      input_area.prepend(new_image);
  
    });
  
  
    // 削除ボタン
    $(document).on('click', '.btn_delete', function() {
  
      // 削除ボタンを押した画像を取得
      var target_image = $(this).parent().parent();
      // 削除画像のdata-image番号を取得
      var target_image_num = target_image.data('image');
      //削除画像のvalueを取得
      if (target_image.val()) {
        var destroy_image_id = target_image.val();
        $(".form-img-box").append(`<input multiple= "multiple" type="number" name="destroy[ids][]" value=${destroy_image_id} class="hidden" >`)
      }
      // 対象の画像をビュー上で削除
      target_image.remove();
  
      // 対象の画像を削除した新たな配列を生成
      images.splice(target_image_num, 1);
  
      // target_image_numが登録済画像の数以下の場合は登録済画像データの配列から削除、それより大きい場合は新たに追加した画像データの配列から削除
      if (target_image_num < registered_images_ids.length) {
        registered_images_ids.splice(target_image_num, 1);
      } else {
        new_image_files.splice((target_image_num - registered_images_ids.length), 1);
      }
  
      if(images.length == 0) {
        $('input[type= "file"].upload-image').attr({
          'data-image': 0
        })
      }
  
      // 削除後の配列の中身の数で条件分岐
      // 画像が４枚以下のとき
      if (images.length <= 4) {
        preview.empty();
        $.each(images, function(index, image) {
          image.data('image', index);
          preview.append(image);
        })
        dropzone.css({
          'width': `calc(100% - (20% * ${images.length}))`,
          'display': 'block'
        })
        appendzone.css({
          'display': 'none'
        })
  
      // 画像が５枚のとき１段目の枠を消し、２段目の枠を出す
      } else if (images.length == 5) {
        preview.empty();
        $.each(images, function(index, image) {
          image.data('image', index);
          preview.append(image);
        })
        appendzone.css({
          'display': 'block',
        })
        dropzone2.css({
          'width': '100%'
        })
        dropzone.css({
          'display': 'none'
        })
        preview2.empty();
  
      // 画像が６枚以上のとき
      } else {
        // １〜５枚目の画像を抽出
        var pickup_images1 = images.slice(0, 5);
  
        // １〜５枚目を１段目に表示
        preview.empty();
        $.each(pickup_images1, function(index, image) {
          image.data('image', index);
          preview.append(image);
        })
  
        // ６枚目以降の画像を抽出
        var pickup_images2 = images.slice(5);
  
        // ６枚目以降を２段目に表示
        $.each(pickup_images2, function(index, image) {
          image.data('image', index + 5);
          preview2.append(image);
          dropzone2.css({
            'display': 'block',
            'width': `calc(100% - (20% * ${images.length - 5}))`
          })
        })
      }
      
    })
  }
});