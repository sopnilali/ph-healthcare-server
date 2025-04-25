import { UserStatus } from "@prisma/client"
import prisma from "../../utils/prisma"
import * as bcrypt from 'bcrypt'
import AppError from "../../errors/AppError"
import generateToken from "../../utils/generateToken"
import config from "../../config"

const loginUserIntoDB = async(payload: any)=> {
    const userData = await prisma.user.findFirstOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const incorrectPassword = await bcrypt.hash(payload.password, userData.password)
    if(!incorrectPassword){
        throw new AppError(httpStatus.BAD_REQUEST, "Password is incorrect")
    }

    const jwtPayloadData = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        status: userData.status
    }

    const accessToken =  generateToken(jwtPayloadData, config.jwt.jwt_access_secret as string, config.jwt.jwt_access_expires_in as string)
    const refreshToken =  generateToken(jwtPayloadData, config.jwt.jwt_refresh_secret as string, config.jwt.jwt_refresh_expires_in as string)

    return {
        accessToken,
        refreshToken
    }
}

export const AuthService = {
    loginUserIntoDB
}