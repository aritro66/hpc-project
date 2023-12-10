#include <bits/stdc++.h>
#include <time.h>

#include <complex>
#include <iostream>

using namespace std;

const int BYTES_PER_PIXEL = 3; /// red, green, & blue
const int FILE_HEADER_SIZE = 14;
const int INFO_HEADER_SIZE = 40;
const int WIDTH = 1920;
const int HEIGHT = 1080;
unsigned char image[HEIGHT][WIDTH][3];

unsigned char *createBitmapFileHeader(int height, int stride)
{
    int fileSize = FILE_HEADER_SIZE + INFO_HEADER_SIZE + (stride * height);

    static unsigned char fileHeader[] = {
        0, 0,       /// signature
        0, 0, 0, 0, /// image file size in bytes
        0, 0, 0, 0, /// reserved
        0, 0, 0, 0, /// start of pixel array
    };

    fileHeader[0] = (unsigned char)('B');
    fileHeader[1] = (unsigned char)('M');
    fileHeader[2] = (unsigned char)(fileSize);
    fileHeader[3] = (unsigned char)(fileSize >> 8);
    fileHeader[4] = (unsigned char)(fileSize >> 16);
    fileHeader[5] = (unsigned char)(fileSize >> 24);
    fileHeader[10] = (unsigned char)(FILE_HEADER_SIZE + INFO_HEADER_SIZE);

    return fileHeader;
}

unsigned char *createBitmapInfoHeader(int height, int width)
{
    static unsigned char infoHeader[] = {
        0, 0, 0, 0, /// header size
        0, 0, 0, 0, /// image width
        0, 0, 0, 0, /// image height
        0, 0,       /// number of color planes
        0, 0,       /// bits per pixel
        0, 0, 0, 0, /// compression
        0, 0, 0, 0, /// image size
        0, 0, 0, 0, /// horizontal resolution
        0, 0, 0, 0, /// vertical resolution
        0, 0, 0, 0, /// colors in color table
        0, 0, 0, 0, /// important color count
    };

    infoHeader[0] = (unsigned char)(INFO_HEADER_SIZE);
    infoHeader[4] = (unsigned char)(width);
    infoHeader[5] = (unsigned char)(width >> 8);
    infoHeader[6] = (unsigned char)(width >> 16);
    infoHeader[7] = (unsigned char)(width >> 24);
    infoHeader[8] = (unsigned char)(height);
    infoHeader[9] = (unsigned char)(height >> 8);
    infoHeader[10] = (unsigned char)(height >> 16);
    infoHeader[11] = (unsigned char)(height >> 24);
    infoHeader[12] = (unsigned char)(1);
    infoHeader[14] = (unsigned char)(BYTES_PER_PIXEL * 8);

    return infoHeader;
}

void generateBitmapImage(unsigned char *image, int height, int width,
                         char *imageFileName)
{
    int widthInBytes = width * BYTES_PER_PIXEL;

    unsigned char padding[3] = {0, 0, 0};
    int paddingSize = (4 - (widthInBytes) % 4) % 4;

    int stride = (widthInBytes) + paddingSize;

    FILE *imageFile = fopen(imageFileName, "wb");

    unsigned char *fileHeader = createBitmapFileHeader(height, stride);
    fwrite(fileHeader, 1, FILE_HEADER_SIZE, imageFile);

    unsigned char *infoHeader = createBitmapInfoHeader(height, width);
    fwrite(infoHeader, 1, INFO_HEADER_SIZE, imageFile);

    int i;
    for (i = 0; i < height; i++)
    {
        fwrite(image + (i * widthInBytes), BYTES_PER_PIXEL, width, imageFile);
        fwrite(padding, 1, paddingSize, imageFile);
    }

    fclose(imageFile);
}

vector<int> HSVtoRGB(vector<double> hsv)
{
    double hue = hsv[0];
    double saturation = hsv[1];
    double value = hsv[2];
    hue = std::fmod(hue, 360.0);
    if (hue < 0.0)
        hue += 360.0;

    double chroma = saturation * value;
    double h_prime = hue / 60.0;
    double x = chroma * (1.0 - std::abs(std::fmod(h_prime, 2.0) - 1.0));
    double r, g, b;

    if (h_prime >= 0.0 && h_prime < 1.0)
    {
        r = chroma;
        g = x;
        b = 0.0;
    }
    else if (h_prime >= 1.0 && h_prime < 2.0)
    {
        r = x;
        g = chroma;
        b = 0.0;
    }
    else if (h_prime >= 2.0 && h_prime < 3.0)
    {
        r = 0.0;
        g = chroma;
        b = x;
    }
    else if (h_prime >= 3.0 && h_prime < 4.0)
    {
        r = 0.0;
        g = x;
        b = chroma;
    }
    else if (h_prime >= 4.0 && h_prime < 5.0)
    {
        r = x;
        g = 0.0;
        b = chroma;
    }
    else if (h_prime >= 5.0 && h_prime < 6.0)
    {
        r = chroma;
        g = 0.0;
        b = x;
    }
    else
    {
        r = 0.0;
        g = 0.0;
        b = 0.0;
    }
    double m = value - chroma;
    r += m;
    g += m;
    b += m;

    return {(int)(r * 255), (int)(g * 255), (int)(b * 255)};
}

void displayMandelbrotSet(int ixsize, int iysize, double cxmin, double cxmax,
                          double cymin, double cymax, int max_iter,
                          vector<int> color1, vector<int> color2)
{
    for (int ix = 0; ix < ixsize; ++ix)
    {
        for (int iy = 0; iy < iysize; ++iy)
        {
            complex<double> c(cxmin + ix / (ixsize - 1.0) * (cxmax - cxmin),
                              cymin + iy / (iysize - 1.0) * (cymax - cymin));
            complex<double> z(0.0, 0.0);
            int min_iter = 0;
            int iter;
            for (iter = min_iter; iter < max_iter; ++iter)
            {
                if (abs(z) > 2.0)
                    break;
                z = z * z + c;
            }
            vector<double> hsv(3);
            hsv[0] = 240 * (double)iter / (double)max_iter;
            hsv[1] = 1.0;
            hsv[2] = 1.0;
            vector<int> rgb = HSVtoRGB(hsv);
            image[iy][ix][2] = (unsigned char)rgb[0];
            image[iy][ix][1] = (unsigned char)rgb[1];
            image[iy][ix][0] = (unsigned char)rgb[2];
        }
    }
}

int main(int argc, char **argv)
{
    int ixsize = WIDTH;
    int iysize = HEIGHT;
    double cxmin = -2.0;
    double cxmax = 1.0;
    double cymin = -1.5;
    double cymax = 1.5;
    int max_iter = 512;

    vector<int> color1 = {255, 0, 0};
    vector<int> color2 = {0, 0, 255};
    vector<int> black = {0, 0, 0};

    clock_t start = clock();

    displayMandelbrotSet(ixsize, iysize, cxmin, cxmax, cymin, cymax, max_iter,
                         color1, color2);

    char *filename = (char *)"output.bmp";

    generateBitmapImage((unsigned char *)image, iysize, ixsize, filename);

    clock_t end = clock();
    cout << "Time taken: " << (double)(end - start) / CLOCKS_PER_SEC << " sec"
         << endl;

    return 0;
}