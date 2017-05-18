package com.example.mukul.raindrop;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.view.View;

import java.util.Random;

/**
 * Created by mukul on 04/01/2017.
 */
public class Drop extends View {

    Random rand=new Random();

    float mX,mY,mZ;
    int hight,width;
    float yspeed;
   float len;

     Paint mPaint=new Paint(Paint.ANTI_ALIAS_FLAG);

    public Drop(Context context) {
        super(context);


        width= Resources.getSystem().getDisplayMetrics().widthPixels;
        hight= Resources.getSystem().getDisplayMetrics().heightPixels;

        this.mX=rand.nextInt(width);
        this.mY=rand.nextInt(hight);
        this.yspeed=map(mZ,0,20,1,20);
        this.len=map(mZ,0,20,10,20);
        this.mZ=rand.nextInt(20);



        mPaint.setColor(Color.parseColor("#FF8A2BDF"));
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        canvas.drawLine(mX,mY,mX,mY+len,mPaint);
        mPaint.setStrokeWidth(2);
    }

    public void fall() {
        mY +=yspeed;
        yspeed=yspeed+map(mZ,0,10,0,0.2f);
        yspeed =yspeed+rand.nextInt(5);
        if(mY>hight)
        {
            mY=0;
            yspeed=map(mZ,0,10,4,10);

        }
    }

    static public final float map(float value,
                                  float istart,
                                  float istop,
                                  float ostart,
                                  float ostop) {
        return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    }
}
